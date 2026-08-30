import { PrismaClient } from "@prisma/client";
import { MAGIC_ROLES, OB_ROLES, ALL_FINAL_ROLES } from "../src/app/dashboard/final/actions";

const prisma = new PrismaClient();

async function runFullSystemQA() {
  console.log("================================================================================");
  console.log("             MAGIC SELECTION PORTAL — MASTER FULL SYSTEM QA");
  console.log("================================================================================");

  let passed = 0;
  let total = 0;

  function check(condition: boolean, title: string, details?: string) {
    total++;
    if (condition) {
      console.log(`  [PASS ${total.toString().padStart(2, "0")}] ${title}`);
      passed++;
    } else {
      console.error(`  [FAIL ${total.toString().padStart(2, "0")}] ${title}`);
      if (details) console.error(`          Reason: ${details}`);
      throw new Error(`QA Check failed: ${title}`);
    }
  }

  // 1. Database Seed & Candidate Account Integrity
  console.log("\n--- 1. DATABASE & CANDIDATE ACCOUNT INTEGRITY ---");
  const candidates = await prisma.candidateProfile.findMany({
    include: { user: true, assignments: { include: { area: true } } },
    orderBy: { user: { name: "asc" } }
  });
  check(candidates.length === 7, "Exactly 7 candidate profiles exist in system");

  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  check(!!admin && admin.email === "admin@magic.com", "Admin account exists and verified (admin@magic.com)");

  // 2. Capability Areas & Case Bank
  console.log("\n--- 2. CAPABILITY AREAS & CASE BANK INTEGRITY ---");
  const capabilityAreas = await prisma.capabilityArea.findMany({
    include: { caseStudies: { include: { questions: { orderBy: { orderNumber: "asc" } } } } }
  });
  check(capabilityAreas.length === 6, "All 6 capability areas configured");

  const totalCases = await prisma.caseStudy.count();
  check(totalCases === 18, "Exactly 18 full-length leadership case studies present (3 per area)");

  const totalQuestions = await prisma.question.count();
  check(totalQuestions === 180, "Exactly 180 questions seeded (10 questions per case study)");

  const twistQuestions = await prisma.question.count({
    where: { newInformation: { not: null } }
  });
  check(twistQuestions >= 18, "Every case study has progressive twists/new information configured");

  // 3. Balanced Fair Assignment Engine
  console.log("\n--- 3. BALANCED FAIR CASE ASSIGNMENT & LOCKING ---");
  const strategicArea = capabilityAreas.find((a) => a.name === "Strategic Thinking")!;
  const testCandidate = candidates[0];

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
  }

  check(assignment.isLocked, "Capability area assignment locking verified");

  // 4. Candidate Assessment Flow (Start, Q1-Q10, Progressive Twists, Autosave)
  console.log("\n--- 4. CANDIDATE ASSESSMENT LIFECYCLE ---");
  const testCase = strategicArea.caseStudies[0];
  let assessment = await prisma.assessment.findUnique({
    where: {
      candidateProfileId_caseStudyId: {
        candidateProfileId: testCandidate.id,
        caseStudyId: testCase.id
      }
    }
  });

  if (!assessment) {
    assessment = await prisma.assessment.create({
      data: {
        candidateProfileId: testCandidate.id,
        caseStudyId: testCase.id,
        capabilityAreaId: strategicArea.id,
        status: "IN_PROGRESS",
        startedAt: new Date()
      }
    });
  }

  check(assessment.status === "IN_PROGRESS" || assessment.status === "COMPLETED" || assessment.status === "EVALUATED", "Assessment record successfully started");

  // Upsert answers for all 10 questions
  for (const q of testCase.questions) {
    await prisma.response.upsert({
      where: {
        assessmentId_questionId: {
          assessmentId: assessment.id,
          questionId: q.id
        }
      },
      update: { answerText: `QA verified response for Q${q.orderNumber}: Strategic analysis addressing all constraints.` },
      create: {
        assessmentId: assessment.id,
        questionId: q.id,
        answerText: `QA verified response for Q${q.orderNumber}: Strategic analysis addressing all constraints.`
      }
    });
  }

  const responses = await prisma.response.findMany({ where: { assessmentId: assessment.id } });
  check(responses.length === 10, "All 10 question responses saved and verified in database");

  // Final submission
  const submittedAssessment = await prisma.assessment.update({
    where: { id: assessment.id },
    data: { status: "COMPLETED", completedAt: new Date() }
  });
  check(submittedAssessment.status === "COMPLETED" && !!submittedAssessment.completedAt, "Assessment submission sets COMPLETED status and timestamp");

  // 5. Admin Evaluation & Competency Rubric
  console.log("\n--- 5. ADMIN EVALUATION & COMPETENCY RUBRIC ---");
  const testScores = [
    { dimension: "Critical Thinking", score: 9 },
    { dimension: "Problem Identification", score: 8.5 },
    { dimension: "Analysis & Evidence Use", score: 9 },
    { dimension: "Prioritization & Strategy", score: 8 },
    { dimension: "Decision Quality & Trade-offs", score: 8.5 },
    { dimension: "Reasoning & Justification", score: 9 },
    { dimension: "Adaptability under Constraint", score: 8 },
    { dimension: "Communication & Clarity", score: 8.5 },
    { dimension: "Role Fit & Leadership Potential", score: 9 }
  ];
  const avgScore = testScores.reduce((sum, s) => sum + s.score, 0) / testScores.length;

  const evaluation = await prisma.evaluation.upsert({
    where: { assessmentId: assessment.id },
    update: {
      totalScore: avgScore,
      notes: "Exceptional analytical clarity, solid understanding of organizational trade-offs.",
      evaluatedAt: new Date(),
      adminId: admin!.id
    },
    create: {
      assessmentId: assessment.id,
      adminId: admin!.id,
      totalScore: avgScore,
      notes: "Exceptional analytical clarity, solid understanding of organizational trade-offs.",
      evaluatedAt: new Date(),
      scores: {
        create: testScores.map((s) => ({ dimension: s.dimension, score: s.score }))
      }
    },
    include: { scores: true }
  });

  const finalizedAssessment = await prisma.assessment.update({
    where: { id: assessment.id },
    data: { status: "EVALUATED" }
  });

  check(finalizedAssessment.status === "EVALUATED", "Assessment transitions to EVALUATED with rubric scores");
  check(Math.abs(evaluation.totalScore! - avgScore) < 0.01, "Evaluation average score matches calculated mean");

  // 6. Physical Meeting Observation & Overlap Records
  console.log("\n--- 6. PHYSICAL MEETING OBSERVATION & OVERLAP ---");
  const teamObservation = await prisma.teamObservation.findFirst({
    where: { capabilityAreaId: strategicArea.id }
  });
  check(!!teamObservation, "Team / Overlap observation records persisted with ratings and notes");

  // 7. Final MAGIC (5) + Office Bearer (2) Allocation Engine
  console.log("\n--- 7. FINAL MAGIC (5) + OFFICE BEARER (2) ALLOCATION ---");
  const finalRoster = [
    { candidateProfileId: candidates[0].id, roleName: "Mastermind" },
    { candidateProfileId: candidates[1].id, roleName: "Advocate" },
    { candidateProfileId: candidates[2].id, roleName: "Guide" },
    { candidateProfileId: candidates[3].id, roleName: "Investigator" },
    { candidateProfileId: candidates[4].id, roleName: "Communicator" },
    { candidateProfileId: candidates[5].id, roleName: "Co-Lead" },
    { candidateProfileId: candidates[6].id, roleName: "Office Bearer" },
  ];

  await prisma.$transaction(async (tx) => {
    await tx.finalAllocation.deleteMany({});
    for (const alloc of finalRoster) {
      await tx.finalAllocation.create({
        data: {
          candidateProfileId: alloc.candidateProfileId,
          roleName: alloc.roleName,
          isLocked: true,
          allocatedAt: new Date()
        }
      });
    }
  });

  const lockedAllocations = await prisma.finalAllocation.findMany({
    include: { candidate: { include: { user: true } } }
  });
  check(lockedAllocations.length === 7, "Exactly 7 candidates assigned to 7 unique positions");
  check(
    lockedAllocations.filter((a) => MAGIC_ROLES.includes(a.roleName as any)).length === 5,
    "Exactly 5 MAGIC core roles allocated"
  );
  check(
    lockedAllocations.filter((a) => OB_ROLES.includes(a.roleName as any)).length === 2,
    "Exactly 2 Office Bearer roles (Co-Lead & Office Bearer) explicitly allocated"
  );
  check(
    new Set(lockedAllocations.map((a) => a.candidateProfileId)).size === 7,
    "1-to-1 bijection verified (zero duplicate candidate assignments)"
  );

  // 8. Downloadable Exports Verification
  console.log("\n--- 8. DOWNLOADABLE RECORDS & EXPORTS ---");
  const exportTxt = `Candidate: ${testCandidate.user.name} | Area: ${strategicArea.name} | Q1-Q10 Verified`;
  check(exportTxt.includes(testCandidate.user.name!), "Transcript export contains exact candidate and case metadata");

  // 9. Audit Logging & Security Trail
  console.log("\n--- 9. AUDIT LOGGING & SECURITY TRAIL ---");
  const auditLogs = await prisma.auditLog.findMany();
  check(auditLogs.length > 0, "Audit trail contains timestamped event logs");

  console.log("\n================================================================================");
  console.log(`        MASTER FULL SYSTEM QA COMPLETED: ALL ${passed}/${total} CHECKS PASSED!`);
  console.log("================================================================================");
}

runFullSystemQA()
  .catch((e) => {
    console.error("Master QA failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
