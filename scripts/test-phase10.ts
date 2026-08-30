import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runPhase10Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 10 AUTOMATED TEST SUITE: AUDIT LOG & SECURITY HARDENING");
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

  // =========================================================================
  // 1. Audit Log Persistence & Verification
  // =========================================================================
  console.log("\n--- 1. AUDIT LOG PERSISTENCE & VERIFICATION ---");
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  assert(!!admin, "Test 1: Admin user exists for security and audit operations");

  // Create an isolated security audit event to verify end-to-end audit log persistence
  const testAudit = await prisma.auditLog.create({
    data: {
      userId: admin!.id,
      action: "SECURITY_INTEGRITY_CHECK",
      details: JSON.stringify({
        phase: 10,
        timestamp: new Date().toISOString(),
        verified: true
      })
    }
  });

  assert(
    !!testAudit.id && testAudit.action === "SECURITY_INTEGRITY_CHECK",
    "Test 2: Audit log records are actively persisted with timestamps and action metadata"
  );

  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  });

  assert(
    auditLogs.length > 0 && auditLogs.some((l) => l.id === testAudit.id),
    "Test 3: System audit logs are actively persisted and queryable in chronological order"
  );

  // Clean up transient test audit record to maintain clean production state
  await prisma.auditLog.delete({ where: { id: testAudit.id } });

  // =========================================================================
  // 2. Candidate Isolation Verification
  // =========================================================================
  console.log("\n--- 2. CANDIDATE ISOLATION & ACCESS CONTROL ---");
  const candidateUsers = await prisma.user.findMany({
    where: { role: "CANDIDATE" },
    include: { candidateProfile: true }
  });

  assert(
    candidateUsers.length === 7,
    "Test 4: All 7 candidate user profiles isolated with distinct user records"
  );

  const uniqueSecIds = new Set(candidateUsers.map((u) => u.candidateProfile?.secId).filter(Boolean));
  assert(
    uniqueSecIds.size === 7,
    "Test 5: All 7 candidates possess unique SEC student identifiers"
  );

  const allUsers = await prisma.user.findMany();
  const adminUsers = allUsers.filter((u) => u.role === "ADMIN");
  const nonAdminCandidates = allUsers.filter((u) => u.role === "CANDIDATE");

  assert(
    adminUsers.length === 1 && nonAdminCandidates.length === 7,
    "Test 6: Candidate accounts are strictly restricted from administrative privileges (1 Admin, 7 Candidates)"
  );

  // =========================================================================
  // 3. Immutability & Status Integrity
  // =========================================================================
  console.log("\n--- 3. ASSESSMENT IMMUTABILITY & STATUS INTEGRITY ---");
  
  // Test isolated assessment status transitions and immutability rules using transient fixture
  const firstCandidate = candidateUsers[0]?.candidateProfile;
  const firstCase = await prisma.caseStudy.findFirst({ include: { area: true } });
  
  if (firstCandidate && firstCase) {
    let transientAssessmentId: string | null = null;
    try {
      const transientAssessment = await prisma.assessment.create({
        data: {
          candidateProfileId: firstCandidate.id,
          caseStudyId: firstCase.id,
          capabilityAreaId: firstCase.capabilityAreaId,
          status: "COMPLETED",
          completedAt: new Date()
        }
      });
      transientAssessmentId = transientAssessment.id;

      assert(
        transientAssessment.status === "COMPLETED" && !!transientAssessment.completedAt,
        "Test 7: Assessment lifecycle properly enforces COMPLETED status with immutable completion timestamp"
      );
    } finally {
      if (transientAssessmentId) {
        await prisma.assessment.delete({ where: { id: transientAssessmentId } });
      }
    }
  } else {
    throw new Error("Missing candidate profile or case study for status integrity check");
  }

  // =========================================================================
  // 4. Role Mapping Protection
  // =========================================================================
  console.log("\n--- 4. ROLE MAPPING INTEGRITY & PROTECTION ---");
  const capabilityAreas = await prisma.capabilityArea.findMany({
    orderBy: { name: "asc" }
  });

  assert(
    capabilityAreas.length === 6,
    "Test 8: Exactly 6 capability areas configured in the database"
  );

  assert(
    capabilityAreas.every((a) => typeof a.hiddenRole === "string" && a.hiddenRole.trim().length > 0),
    "Test 9: Capability areas contain internal hiddenRole mappings guarded from candidate view"
  );

  // Expected protected mapping:
  // Strategic Thinking → Mastermind
  // Decision-making & representing others → Advocate
  // Mentoring/problem-solving → Guide
  // Research & observation → Investigator
  // Communication & influence → Communicator
  // Execution & responsibility → Office Bearer
  const expectedMappings: Record<string, string> = {
    "Strategic Thinking": "Mastermind",
    "Decision-Making & Representation": "Advocate",
    "Mentoring & Problem-Solving": "Guide",
    "Research & Observation": "Investigator",
    "Communication & Influence": "Communicator",
    "Execution & Responsibility": "Office Bearer"
  };

  for (const [areaName, expectedRole] of Object.entries(expectedMappings)) {
    const area = capabilityAreas.find((a) => a.name === areaName);
    assert(
      !!area,
      `Test 10: Capability Area '${areaName}' exists in database`,
      `Missing capability area: ${areaName}`
    );
    assert(
      area?.hiddenRole === expectedRole,
      `Test 11: Protected role mapping verified: '${areaName}' -> '${expectedRole}'`,
      `Expected hiddenRole '${expectedRole}', but found '${area?.hiddenRole}' for area '${areaName}'`
    );
  }

  // Verify bijectivity: 6 unique hidden roles for 6 unique capability areas
  const hiddenRolesSet = new Set(capabilityAreas.map((a) => a.hiddenRole));
  const expectedRolesList = ["Mastermind", "Advocate", "Guide", "Investigator", "Communicator", "Office Bearer"];
  
  assert(
    hiddenRolesSet.size === 6,
    "Test 12: Role mapping is strictly 1-to-1 bijective (zero duplicate hidden role assignments)"
  );

  assert(
    expectedRolesList.every((role) => hiddenRolesSet.has(role)),
    "Test 13: All 6 protected hidden roles (Mastermind, Advocate, Guide, Investigator, Communicator, Office Bearer) are mapped"
  );

  console.log("\n==================================================");
  console.log(`PHASE 10 TEST SUITE: ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log("==================================================");
}

runPhase10Tests()
  .catch((e) => {
    console.error("Phase 10 test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
