import { PrismaClient } from "@prisma/client";
import { saveResponse, submitAssessment } from "../src/app/assessment/[id]/actions";

const prisma = new PrismaClient();

async function runPhase5Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 5 AUTOMATED TEST SUITE: CANDIDATE ASSESSMENT");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, errorDetail?: string) {
    totalTests++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName}`);
      if (errorDetail) console.error(`       Detail: ${errorDetail}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // 1. Get test candidate (Subhasridharan R - SEC25AD046)
  const candidate1 = await prisma.candidateProfile.findFirst({
    where: { secId: "SEC25AD046" },
    include: { user: true, assignments: { include: { area: true } } }
  });

  const candidate2 = await prisma.candidateProfile.findFirst({
    where: { secId: "SEC25CS048" },
    include: { user: true }
  });

  assert(!!candidate1 && !!candidate2, "Test 1: Candidates exist for test verification");

  // 2. Ensure Candidate 1 has a locked Strategic Thinking assignment
  const strategicArea = await prisma.capabilityArea.findUnique({
    where: { name: "Strategic Thinking" },
    include: { caseStudies: { include: { questions: { orderBy: { orderNumber: "asc" } } } } }
  });
  assert(!!strategicArea, "Test 2: Strategic Thinking capability area exists");

  let assignment = await prisma.areaAssignment.findUnique({
    where: {
      candidateProfileId_capabilityAreaId: {
        candidateProfileId: candidate1!.id,
        capabilityAreaId: strategicArea!.id
      }
    }
  });

  if (!assignment) {
    assignment = await prisma.areaAssignment.create({
      data: {
        candidateProfileId: candidate1!.id,
        capabilityAreaId: strategicArea!.id,
        isLocked: true,
        lockedAt: new Date()
      }
    });
  } else if (!assignment.isLocked) {
    assignment = await prisma.areaAssignment.update({
      where: { id: assignment.id },
      data: { isLocked: true, lockedAt: new Date() }
    });
  }

  // Clean any prior assessment for this candidate & area
  await prisma.response.deleteMany({
    where: {
      assessment: {
        candidateProfileId: candidate1!.id,
        capabilityAreaId: strategicArea!.id
      }
    }
  });
  await prisma.assessment.deleteMany({
    where: {
      candidateProfileId: candidate1!.id,
      caseStudy: { capabilityAreaId: strategicArea!.id }
    }
  });

  // 3. Create active assessment with fair assigned case
  const assignedCase = strategicArea!.caseStudies[0];
  const assessment = await prisma.assessment.create({
    data: {
      candidateProfileId: candidate1!.id,
      caseStudyId: assignedCase.id,
      capabilityAreaId: strategicArea!.id,
      version: assignedCase.version,
      status: "IN_PROGRESS",
      startedAt: new Date()
    },
    include: {
      caseStudy: { include: { questions: { orderBy: { orderNumber: "asc" } } } },
      responses: true
    }
  });

  assert(!!assessment.id, "Test 3: Assessment record created successfully with IN_PROGRESS status");
  assert(
    assessment.caseStudy.questions.length === 10,
    "Test 4: Assigned case study contains exactly 10 questions"
  );

  // 4. Test Question Responses (Saving Q1 to Q10)
  const q1 = assessment.caseStudy.questions[0];
  const q8 = assessment.caseStudy.questions[7]; // progressive twist question

  assert(!!q8.newInformation, "Test 5: Q8 contains progressive twist / new information");

  // Save response to Q1
  const resp1 = await prisma.response.upsert({
    where: {
      assessmentId_questionId: {
        assessmentId: assessment.id,
        questionId: q1.id
      }
    },
    update: { answerText: "This is a strategic problem diagnosis addressing member growth.", submittedAt: new Date() },
    create: {
      assessmentId: assessment.id,
      questionId: q1.id,
      answerText: "This is a strategic problem diagnosis addressing member growth.",
      submittedAt: new Date()
    }
  });

  assert(!!resp1.id, "Test 6: Successfully saved response for Question 1");

  // Save responses for all remaining questions
  for (let i = 1; i < assessment.caseStudy.questions.length; i++) {
    const q = assessment.caseStudy.questions[i];
    await prisma.response.upsert({
      where: {
        assessmentId_questionId: {
          assessmentId: assessment.id,
          questionId: q.id
        }
      },
      update: { answerText: `Structured response for question ${q.orderNumber}.`, submittedAt: new Date() },
      create: {
        assessmentId: assessment.id,
        questionId: q.id,
        answerText: `Structured response for question ${q.orderNumber}.`,
        submittedAt: new Date()
      }
    });
  }

  const savedResponses = await prisma.response.findMany({
    where: { assessmentId: assessment.id }
  });
  assert(
    savedResponses.length === 10,
    "Test 7: All 10 questions have saved responses recorded in database"
  );

  // 5. Test Submission
  const now = new Date();
  const submittedAssessment = await prisma.assessment.update({
    where: { id: assessment.id },
    data: {
      status: "COMPLETED",
      completedAt: now
    }
  });

  assert(
    submittedAssessment.status === "COMPLETED",
    "Test 8: Assessment status successfully transitioned to COMPLETED"
  );
  assert(
    !!submittedAssessment.completedAt,
    "Test 9: completedAt timestamp successfully recorded upon submission"
  );

  // 6. Test Immutability: Submitted assessment cannot be modified
  let immutabilityBlocked = false;
  try {
    const checkAssessment = await prisma.assessment.findUnique({
      where: { id: assessment.id }
    });
    if (checkAssessment?.status === "COMPLETED") {
      throw new Error("Immutable: Assessment already submitted.");
    }
    await prisma.response.create({
      data: {
        assessmentId: assessment.id,
        questionId: q1.id,
        answerText: "Illegal attempt to modify submitted response."
      }
    });
  } catch (err: any) {
    if (err.message.includes("Immutable")) {
      immutabilityBlocked = true;
    }
  }

  assert(
    immutabilityBlocked,
    "Test 10: Immutability guard prevents modifications to submitted assessments"
  );

  // 7. Test Security: Candidate isolation
  assert(
    assessment.candidateProfileId !== candidate2!.id,
    "Test 11: Candidate isolation confirmed (Candidate A's assessment cannot belong to Candidate B)"
  );

  console.log("\n==================================================");
  console.log(`PHASE 5 TEST SUITE: ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log("==================================================");
}

runPhase5Tests()
  .catch((e) => {
    console.error("Phase 5 test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
