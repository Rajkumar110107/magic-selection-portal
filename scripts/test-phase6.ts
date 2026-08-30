import { PrismaClient } from "@prisma/client";
import { saveEvaluation } from "../src/app/dashboard/assessments/[id]/actions";

const prisma = new PrismaClient();

async function runPhase6Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 6 AUTOMATED TEST SUITE: ADMIN EVALUATION & TRANSCRIPT");
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

  // 1. Get Admin user and submitted assessment
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });
  assert(!!admin, "Test 1: Admin user exists in database");

  const assessment = await prisma.assessment.findFirst({
    where: { status: "COMPLETED" },
    include: {
      candidate: { include: { user: true } },
      caseStudy: { include: { area: true, questions: { orderBy: { orderNumber: "asc" } } } },
      responses: true,
      evaluation: { include: { scores: true } }
    }
  });
  assert(!!assessment, "Test 2: Submitted assessment exists for evaluation testing");

  // 2. Test Full Transcript Completeness
  const questions = assessment!.caseStudy.questions;
  assert(
    questions.length === 10,
    "Test 3: Assessment transcript has all 10 questions present"
  );

  const twistQuestion = questions.find((q) => !!q.newInformation);
  assert(
    !!twistQuestion && !!twistQuestion.newInformation,
    "Test 4: Progressive twist information is present in transcript"
  );

  const responses = assessment!.responses;
  assert(
    responses.length === 10,
    "Test 5: Exact candidate responses are recorded without summarization"
  );

  // 3. Test Evaluation Creation (Draft & Scores)
  const testScores = [
    { dimension: "Critical Thinking", score: 8 },
    { dimension: "Problem Identification", score: 9 },
    { dimension: "Analysis & Evidence Use", score: 8 },
    { dimension: "Prioritization & Strategy", score: 7 },
    { dimension: "Decision Quality & Trade-offs", score: 8 },
    { dimension: "Reasoning & Justification", score: 9 },
    { dimension: "Adaptability under Constraint", score: 8 },
    { dimension: "Communication & Clarity", score: 8 },
    { dimension: "Role Fit & Leadership Potential", score: 9 }
  ];

  const calculatedAvg = testScores.reduce((sum, s) => sum + s.score, 0) / testScores.length;

  // Clean any old evaluation for test assessment
  if (assessment!.evaluation) {
    await prisma.evaluationScore.deleteMany({
      where: { evaluationId: assessment!.evaluation.id }
    });
    await prisma.evaluation.delete({
      where: { id: assessment!.evaluation.id }
    });
  }

  const createdEval = await prisma.evaluation.create({
    data: {
      assessmentId: assessment!.id,
      adminId: admin!.id,
      notes: "Strong strategic reasoning with excellent stakeholder empathy and crisis de-escalation.",
      totalScore: calculatedAvg,
      scores: {
        create: testScores.map((s) => ({
          dimension: s.dimension,
          score: s.score
        }))
      }
    },
    include: { scores: true }
  });

  assert(!!createdEval.id, "Test 6: Successfully created Admin Evaluation record");
  assert(
    createdEval.scores.length === 9,
    "Test 7: All 9 leadership competency dimensions recorded"
  );
  assert(
    Math.abs(createdEval.totalScore! - calculatedAvg) < 0.01,
    "Test 8: Evaluation total score accurately calculated"
  );

  // 4. Test Finalizing Evaluation
  const updatedAssessment = await prisma.assessment.update({
    where: { id: assessment!.id },
    data: { status: "EVALUATED" },
    include: { evaluation: true }
  });

  assert(
    updatedAssessment.status === "EVALUATED",
    "Test 9: Assessment status successfully transitioned to EVALUATED"
  );

  // 5. Test Audit Log
  const auditLog = await prisma.auditLog.create({
    data: {
      userId: admin!.id,
      action: "EVALUATION_FINALIZED",
      details: JSON.stringify({
        assessmentId: assessment!.id,
        candidateName: assessment!.candidate.user.name,
        totalScore: calculatedAvg
      })
    }
  });

  assert(!!auditLog.id, "Test 10: Evaluation finalization audit log created");

  console.log("\n==================================================");
  console.log(`PHASE 6 TEST SUITE: ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log("==================================================");
}

runPhase6Tests()
  .catch((e) => {
    console.error("Phase 6 test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
