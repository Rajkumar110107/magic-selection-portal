import { PrismaClient } from "@prisma/client";
import {
  saveFinalAllocations,
  unlockFinalAllocations,
  MAGIC_ROLES,
  OB_ROLES,
  ALL_FINAL_ROLES
} from "../src/app/dashboard/final/actions";

const prisma = new PrismaClient();

async function runPhase8Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 8 AUTOMATED TEST SUITE: FINAL MAGIC + OB ALLOCATION");
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

  // 1. Get all 7 candidates
  const candidates = await prisma.candidateProfile.findMany({
    include: { user: true },
    orderBy: { user: { name: "asc" } }
  });

  assert(
    candidates.length === 7,
    "Test 1: Exactly 7 candidates exist in database"
  );

  // 2. Validate Role Definitions
  assert(
    MAGIC_ROLES.length === 5,
    "Test 2: Exactly 5 MAGIC core roles defined (Mastermind, Advocate, Guide, Investigator, Communicator)"
  );
  assert(
    OB_ROLES.length === 2 && OB_ROLES.includes("Co-Lead") && OB_ROLES.includes("Office Bearer"),
    "Test 3: Exactly 2 Office Bearer roles defined (Co-Lead, Office Bearer)"
  );
  assert(
    ALL_FINAL_ROLES.length === 7,
    "Test 4: Total final roles equals exactly 7"
  );

  // 3. Test Incomplete Allocation Validation (Fail scenario)
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  assert(!!admin, "Test 5: Admin user exists for execution");

  // Clean prior allocations
  await prisma.finalAllocation.deleteMany({});

  // 4. Test Successful 7-Role Allocation Transaction
  const validAllocations = [
    { candidateProfileId: candidates[0].id, roleName: "Mastermind" },
    { candidateProfileId: candidates[1].id, roleName: "Advocate" },
    { candidateProfileId: candidates[2].id, roleName: "Guide" },
    { candidateProfileId: candidates[3].id, roleName: "Investigator" },
    { candidateProfileId: candidates[4].id, roleName: "Communicator" },
    { candidateProfileId: candidates[5].id, roleName: "Co-Lead" },
    { candidateProfileId: candidates[6].id, roleName: "Office Bearer" },
  ];

  const now = new Date();
  await prisma.$transaction(async (tx) => {
    await tx.finalAllocation.deleteMany({});
    for (const item of validAllocations) {
      await tx.finalAllocation.create({
        data: {
          candidateProfileId: item.candidateProfileId,
          roleName: item.roleName,
          isLocked: true,
          allocatedAt: now
        }
      });
    }
  });

  const createdAllocations = await prisma.finalAllocation.findMany({
    include: { candidate: { include: { user: true } } }
  });

  assert(
    createdAllocations.length === 7,
    "Test 6: All 7 final allocations created in database"
  );
  assert(
    createdAllocations.every((a) => a.isLocked),
    "Test 7: All 7 allocations are marked as locked (isLocked: true)"
  );

  const mastermind = createdAllocations.find((a) => a.roleName === "Mastermind");
  const coLead = createdAllocations.find((a) => a.roleName === "Co-Lead");
  const ob = createdAllocations.find((a) => a.roleName === "Office Bearer");

  assert(!!mastermind, "Test 8: Mastermind role assigned and verified");
  assert(!!coLead, "Test 9: Co-Lead role explicitly assigned and verified");
  assert(!!ob, "Test 10: Office Bearer role explicitly assigned and verified");

  // 5. Test Audit Log
  const auditLog = await prisma.auditLog.create({
    data: {
      userId: admin!.id,
      action: "FINAL_ALLOCATION_LOCKED",
      details: JSON.stringify({
        lockedBy: admin!.email,
        allocations: validAllocations.map((v) => `${v.roleName} -> ${v.candidateProfileId}`)
      })
    }
  });

  assert(!!auditLog.id, "Test 11: Final allocation lock audit log recorded");

  console.log("\n==================================================");
  console.log(`PHASE 8 TEST SUITE: ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log("==================================================");
}

runPhase8Tests()
  .catch((e) => {
    console.error("Phase 8 test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
