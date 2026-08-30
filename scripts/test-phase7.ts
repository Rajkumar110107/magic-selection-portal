import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runPhase7Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 7 AUTOMATED TEST SUITE: TEAM OBSERVATION & COMPARISON");
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

  // 1. Get Admin and Candidates
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  const candidates = await prisma.candidateProfile.findMany({ include: { user: true } });

  assert(!!admin, "Test 1: Admin user exists");
  assert(candidates.length >= 2, "Test 2: At least 2 candidates exist for comparison");

  const area = await prisma.capabilityArea.findFirst({ where: { name: "Strategic Thinking" } });
  assert(!!area, "Test 3: Capability area exists");

  // 2. Create Team / Overlap Observation record
  const existingObs = await prisma.teamObservation.findFirst({
    where: { capabilityAreaId: area!.id }
  });

  if (existingObs) {
    await prisma.teamObservationParticipant.deleteMany({
      where: { teamObservationId: existingObs.id }
    });
    await prisma.teamObservation.delete({
      where: { id: existingObs.id }
    });
  }

  const observation = await prisma.teamObservation.create({
    data: {
      capabilityAreaId: area!.id,
      adminId: admin!.id,
      overlapStatus: "DISCUSSED",
      outcome: "Both candidates demonstrated strong long-term roadmapping; Candidate A demonstrated higher peer listening.",
      discussionDate: new Date(),
      notes: "Physical discussion held in Meeting Room 3.",
      overallNotes: "High-quality collaborative dynamic with zero destructive friction.",
      teamworkRating: 8.5,
      communicationRating: 9.0,
      listeningRating: 8.0,
      leadershipRating: 8.5,
      respectRating: 9.5,
      adaptabilityRating: 8.0,
      teamFirstRating: 9.0,
      participants: {
        create: [
          { candidateProfileId: candidates[0].id },
          { candidateProfileId: candidates[1].id }
        ]
      }
    },
    include: {
      participants: { include: { candidate: { include: { user: true } } } },
      area: true
    }
  });

  assert(!!observation.id, "Test 4: Successfully created TeamObservation record with multi-candidate participants");
  assert(
    observation.participants.length === 2,
    "Test 5: TeamObservation contains exactly 2 candidate participants"
  );
  assert(
    observation.teamworkRating === 8.5 && observation.communicationRating === 9.0,
    "Test 6: Qualitative team ratings properly persisted"
  );

  // 3. Test Comparison Query Integrity
  const comparisonCandidates = await prisma.candidateProfile.findMany({
    where: { id: { in: [candidates[0].id, candidates[1].id] } },
    include: {
      user: true,
      assignments: { include: { area: true } },
      assessments: {
        include: {
          caseStudy: { include: { area: true, questions: true } },
          evaluation: { include: { scores: true } },
          responses: true
        }
      },
      teamObservations: {
        include: {
          observation: { include: { area: true, admin: true } }
        }
      }
    }
  });

  assert(
    comparisonCandidates.length === 2,
    "Test 7: Candidate comparison query returns complete candidate dataset"
  );
  assert(
    comparisonCandidates[0].teamObservations.length >= 1,
    "Test 8: Candidate 1 includes linked team observation records"
  );
  assert(
    comparisonCandidates[1].teamObservations.length >= 1,
    "Test 9: Candidate 2 includes linked team observation records"
  );

  console.log("\n==================================================");
  console.log(`PHASE 7 TEST SUITE: ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log("==================================================");
}

runPhase7Tests()
  .catch((e) => {
    console.error("Phase 7 test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
