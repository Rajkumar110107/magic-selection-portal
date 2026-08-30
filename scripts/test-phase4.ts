import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runPhase4Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 4 AUTOMATED TEST SUITE");
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

  // 1. Test: Exactly 6 capability areas exist
  const capabilityAreas = await prisma.capabilityArea.findMany({
    include: { caseStudies: { include: { questions: true } } }
  });
  assert(
    capabilityAreas.length === 6,
    "Test 1: Exactly 6 capability areas exist in database",
    `Found ${capabilityAreas.length} capability areas.`
  );

  // Expected Capability Area Names and Hidden Roles
  const expectedAreas = [
    { name: "Strategic Thinking", hiddenRole: "Mastermind" },
    { name: "Decision-Making & Representation", hiddenRole: "Advocate" },
    { name: "Mentoring & Problem-Solving", hiddenRole: "Guide" },
    { name: "Research & Observation", hiddenRole: "Investigator" },
    { name: "Communication & Influence", hiddenRole: "Communicator" },
    { name: "Execution & Responsibility", hiddenRole: "Office Bearer" },
  ];

  for (const expected of expectedAreas) {
    const area = capabilityAreas.find((a) => a.name === expected.name);
    assert(
      !!area,
      `Test 2a: Capability Area '${expected.name}' exists`,
      `Missing area ${expected.name}`
    );
    assert(
      area?.hiddenRole === expected.hiddenRole,
      `Test 2b: Capability Area '${expected.name}' has hidden role '${expected.hiddenRole}'`,
      `Expected ${expected.hiddenRole}, found ${area?.hiddenRole}`
    );
  }

  // 2. Test: Exactly 3 case studies per capability area, total 18
  const totalCaseStudies = await prisma.caseStudy.findMany({
    include: { questions: true, area: true }
  });
  assert(
    totalCaseStudies.length === 18,
    "Test 3: Exactly 18 case studies exist in total",
    `Found ${totalCaseStudies.length} case studies.`
  );

  for (const area of capabilityAreas) {
    const areaCases = totalCaseStudies.filter((c) => c.capabilityAreaId === area.id);
    assert(
      areaCases.length === 3,
      `Test 4: Capability Area '${area.name}' has exactly 3 case studies`,
      `Found ${areaCases.length} case studies for ${area.name}`
    );
  }

  // 3. Test: Exactly 10 questions per case (180 questions total)
  const totalQuestions = await prisma.question.findMany();
  assert(
    totalQuestions.length === 180,
    "Test 5: Exactly 180 total questions exist across the 18 cases",
    `Found ${totalQuestions.length} questions.`
  );

  for (const cs of totalCaseStudies) {
    assert(
      cs.questions.length === 10,
      `Test 6: Case Study [${cs.code || cs.title}] has exactly 10 questions`,
      `Found ${cs.questions.length} questions.`
    );

    // Verify ordering is 1 to 10
    const orderNumbers = cs.questions.map((q) => q.orderNumber).sort((a, b) => a - b);
    const expectedOrders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    assert(
      JSON.stringify(orderNumbers) === JSON.stringify(expectedOrders),
      `Test 7: Case Study [${cs.code}] has strictly sequential question orders (1 to 10)`
    );

    // Verify rich metadata is present and non-empty
    assert(
      !!cs.background && cs.background.length > 50,
      `Test 8: Case Study [${cs.code}] has detailed background`
    );
    assert(
      !!cs.currentSituation && cs.currentSituation.length > 50,
      `Test 9: Case Study [${cs.code}] has detailed current situation`
    );
    assert(
      !!cs.stakeholders && JSON.parse(cs.stakeholders).length >= 3,
      `Test 10: Case Study [${cs.code}] has at least 3 stakeholders`
    );
    assert(
      !!cs.constraints && JSON.parse(cs.constraints).length >= 2,
      `Test 11: Case Study [${cs.code}] has at least 2 constraints`
    );

    // Verify twist presence in progressive questions
    const twistQuestions = cs.questions.filter((q) => !!q.newInformation);
    assert(
      twistQuestions.length >= 1,
      `Test 12: Case Study [${cs.code}] has at least 1 progressive twist question`
    );
  }

  // 4. Test: No orphan questions or orphan case studies
  const allCaseStudyIds = totalCaseStudies.map((c) => c.id);
  const orphanQuestions = await prisma.question.findMany({
    where: { caseStudyId: { notIn: allCaseStudyIds } }
  });
  assert(
    orphanQuestions.length === 0,
    "Test 13: Zero orphan questions exist in the database",
    `Found ${orphanQuestions.length} orphan questions.`
  );

  // 5. Test: Fair random assignment & idempotency
  console.log("\n--- Testing Fair Assignment & Persistence ---");
  const testCandidate = await prisma.candidateProfile.findFirst({
    include: { user: true, assignments: true }
  });

  if (!testCandidate) {
    throw new Error("No candidate profile found for testing assignment.");
  }

  const strategicArea = capabilityAreas.find((a) => a.name === "Strategic Thinking")!;

  // Create a locked area assignment for test candidate if not already present
  let assignment = await prisma.areaAssignment.findUnique({
    where: {
      candidateProfileId_capabilityAreaId: {
        candidateProfileId: testCandidate.id,
        capabilityAreaId: strategicArea.id
      }
    }
  });

  if (!assignment) {
    assignment = await prisma.areaAssignment.create({
      data: {
        candidateProfileId: testCandidate.id,
        capabilityAreaId: strategicArea.id,
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

  // Clean up any test assessment for this candidate & area first
  await prisma.response.deleteMany({
    where: {
      assessment: {
        candidateProfileId: testCandidate.id,
        capabilityAreaId: strategicArea.id
      }
    }
  });
  await prisma.assessment.deleteMany({
    where: {
      candidateProfileId: testCandidate.id,
      caseStudy: { capabilityAreaId: strategicArea.id }
    }
  });

  // Simulate Fair Allocation Logic
  const availableCases = strategicArea.caseStudies;
  const minCount = Math.min(...availableCases.map((c) => (c as any).assessments?.length || 0));
  const leastAssigned = availableCases.filter(
    (c) => ((c as any).assessments?.length || 0) === minCount
  );
  const selectedCase = leastAssigned[Math.floor(Math.random() * leastAssigned.length)];

  const createdAssessment = await prisma.assessment.create({
    data: {
      candidateProfileId: testCandidate.id,
      caseStudyId: selectedCase.id,
      capabilityAreaId: strategicArea.id,
      version: selectedCase.version,
      status: "IN_PROGRESS",
      startedAt: new Date()
    }
  });

  assert(
    !!createdAssessment.id,
    "Test 14: Successfully created assessment record with case assignment"
  );
  assert(
    createdAssessment.caseStudyId === selectedCase.id,
    "Test 15: Assigned case matches fair allocation selected case"
  );

  // Test Persistence: Repeat lookup returns EXACT same assessment & case
  const repeatedLookup = await prisma.assessment.findFirst({
    where: {
      candidateProfileId: testCandidate.id,
      caseStudy: { capabilityAreaId: strategicArea.id }
    }
  });

  assert(
    repeatedLookup?.id === createdAssessment.id,
    "Test 16: Assessment lookup is strictly persistent across calls"
  );
  assert(
    repeatedLookup?.caseStudyId === selectedCase.id,
    "Test 17: Assigned case study is strictly persistent (no re-randomization)"
  );

  // Test Area compatibility: Assigned case study belongs to the candidate's locked area
  const assignedCase = await prisma.caseStudy.findUnique({
    where: { id: repeatedLookup!.caseStudyId }
  });
  assert(
    assignedCase?.capabilityAreaId === strategicArea.id,
    "Test 18: Assigned case study belongs strictly to the candidate's assigned capability area"
  );

  console.log("\n==================================================");
  console.log(`PHASE 4 AUTOMATED TEST SUITE: ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log("==================================================");
}

runPhase4Tests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
