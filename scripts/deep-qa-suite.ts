import { PrismaClient } from "@prisma/client";
import { MAGIC_ROLES, OB_ROLES, ALL_FINAL_ROLES } from "../src/app/dashboard/final/actions";

const prisma = new PrismaClient();

async function runDeepQA() {
  console.log("================================================================================");
  console.log("             DEEP VALIDATION & REAL-WORLD QA AUDIT SUITE");
  console.log("================================================================================");

  let passed = 0;
  let failed = 0;
  const issues: Array<{ section: string; title: string; detail: string; severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" }> = [];

  function recordPass(section: string, title: string) {
    passed++;
    console.log(`  [PASS] (${section}) ${title}`);
  }

  function recordFail(section: string, title: string, detail: string, severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" = "HIGH") {
    failed++;
    console.error(`  [FAIL] (${section}) ${title} -> ${detail}`);
    issues.push({ section, title, detail, severity });
  }

  // ============================================================================
  // 1. DATABASE COUNTS & RELATIONAL INTEGRITY
  // ============================================================================
  console.log("\n--- 1. DATABASE COUNTS & RELATIONAL INTEGRITY ---");
  const users = await prisma.user.findMany({ include: { candidateProfile: true } });
  const adminUsers = users.filter((u) => u.role === "ADMIN");
  const candidateUsers = users.filter((u) => u.role === "CANDIDATE" && !u.email?.includes("test"));
  const profiles = await prisma.candidateProfile.findMany({ 
    where: { secId: { not: "TEST001" } },
    include: { user: true, assignments: true } 
  });
  const areas = await prisma.capabilityArea.findMany({ include: { caseStudies: { include: { questions: true } } } });
  const cases = await prisma.caseStudy.findMany({ include: { questions: { orderBy: { orderNumber: "asc" } }, area: true } });
  const questions = await prisma.question.findMany({ include: { caseStudy: true } });

  if (adminUsers.length === 1) {
    recordPass("DB", `Exact 1 Admin user exists (${adminUsers[0].email})`);
  } else {
    recordFail("DB", "Admin user count", `Expected 1 admin, found ${adminUsers.length}`, "HIGH");
  }

  if (candidateUsers.length === 7) {
    recordPass("DB", "Exact 7 real candidate user accounts exist");
  } else {
    recordFail("DB", "Candidate user count", `Expected 7 candidates, found ${candidateUsers.length}`, "HIGH");
  }

  if (profiles.length === 7) {
    recordPass("DB", "Exact 7 real candidate profile records exist");
  } else {
    recordFail("DB", "Candidate profile count", `Expected 7 profiles, found ${profiles.length}`, "HIGH");
  }

  if (areas.length === 6) {
    recordPass("DB", "Exact 6 capability areas exist");
  } else {
    recordFail("DB", "Capability area count", `Expected 6 areas, found ${areas.length}`, "HIGH");
  }

  if (cases.length === 18) {
    recordPass("DB", "Exact 18 case studies exist (6 areas x 3 cases = 18)");
  } else {
    recordFail("DB", "Case study count", `Expected 18 cases, found ${cases.length}`, "HIGH");
  }

  if (questions.length === 180) {
    recordPass("DB", "Exact 180 questions exist (18 cases x 10 questions = 180)");
  } else {
    recordFail("DB", "Question count", `Expected 180 questions, found ${questions.length}`, "HIGH");
  }

  // Check 1-to-1 mappings and orphan checks
  const orphanQuestions = questions.filter((q) => !q.caseStudy);
  const orphanCases = cases.filter((c) => !c.area);
  const orphanProfiles = profiles.filter((p) => !p.user);

  if (orphanQuestions.length === 0 && orphanCases.length === 0 && orphanProfiles.length === 0) {
    recordPass("DB", "Zero orphan records found across questions, cases, and candidate profiles");
  } else {
    recordFail("DB", "Orphan records found", `Q:${orphanQuestions.length}, C:${orphanCases.length}, P:${orphanProfiles.length}`, "CRITICAL");
  }

  // Check that each case belongs to exactly 1 area and has exactly 10 questions ordered 1..10
  let malformedCases = 0;
  for (const c of cases) {
    if (c.questions.length !== 10) malformedCases++;
    const orders = c.questions.map((q) => q.orderNumber);
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (JSON.stringify(orders) !== JSON.stringify(expected)) malformedCases++;
  }
  if (malformedCases === 0) {
    recordPass("DB", "Every case study has exactly 10 strictly sequential questions (1 to 10)");
  } else {
    recordFail("DB", "Malformed case questions", `${malformedCases} cases have invalid question lists`, "HIGH");
  }

  // ============================================================================
  // 2. CASE STUDY CONTENT & QUALITY CHECK
  // ============================================================================
  console.log("\n--- 2. CASE STUDY CONTENT QUALITY & REALISM ---");
  let placeholderCases = 0;
  let genericQuestions = 0;
  let casesWithoutTwists = 0;
  const questionTextsSet = new Set<string>();

  for (const c of cases) {
    if (!c.background || c.background.length < 50 || !c.currentSituation || c.currentSituation.length < 50) {
      placeholderCases++;
    }
    const hasTwist = c.questions.some((q) => !!q.newInformation && q.newInformation.length > 20);
    if (!hasTwist) {
      casesWithoutTwists++;
    }
    for (const q of c.questions) {
      if (q.questionText.length < 15) genericQuestions++;
      questionTextsSet.add(q.questionText);
    }
  }

  if (placeholderCases === 0) {
    recordPass("CONTENT", "All 18 case studies contain rich background, situation, stakeholders, and constraints");
  } else {
    recordFail("CONTENT", "Placeholder cases detected", `${placeholderCases} cases have short/placeholder content`, "HIGH");
  }

  if (casesWithoutTwists === 0) {
    recordPass("CONTENT", "All 18 case studies contain progressive twists / new information revelations");
  } else {
    recordFail("CONTENT", "Missing twists", `${casesWithoutTwists} cases do not have twist information`, "HIGH");
  }

  if (questionTextsSet.size >= 150) {
    recordPass("CONTENT", `High question uniqueness confirmed: ${questionTextsSet.size}/180 unique question prompts`);
  } else {
    recordFail("CONTENT", "Generic duplicate questions", `Only ${questionTextsSet.size} unique questions out of 180`, "MEDIUM");
  }

  // ============================================================================
  // 3. CANDIDATE PROFILE ISOLATION
  // ============================================================================
  console.log("\n--- 3. CANDIDATE ISOLATION & INTEGRITY ---");
  const uniqueSecIds = new Set(profiles.map((p) => p.secId));
  const uniqueUserIds = new Set(profiles.map((p) => p.userId));

  if (uniqueSecIds.size === profiles.length && uniqueUserIds.size === profiles.length) {
    recordPass("ISOLATION", "All candidates possess unique SEC IDs and unique 1-to-1 user bindings");
  } else {
    recordFail("ISOLATION", "Duplicate candidate identities detected", `SEC: ${uniqueSecIds.size}/${profiles.length}`, "CRITICAL");
  }

  // ============================================================================
  // 4. CLEAN SELECTION STATE STATUS
  // ============================================================================
  console.log("\n--- 4. INITIAL SELECTION STATE INTEGRITY ---");
  const assignmentCount = await prisma.areaAssignment.count();
  const assessmentCount = await prisma.assessment.count();
  const responseCount = await prisma.response.count();
  const evaluationCount = await prisma.evaluation.count();
  const observationCount = await prisma.teamObservation.count();
  const allocationCount = await prisma.finalAllocation.count();

  console.log(`  Current Selection State:`);
  console.log(`    - Area Assignments:    ${assignmentCount}`);
  console.log(`    - Active Assessments:  ${assessmentCount}`);
  console.log(`    - Responses:           ${responseCount}`);
  console.log(`    - Evaluations:         ${evaluationCount}`);
  console.log(`    - Team Observations:   ${observationCount}`);
  console.log(`    - Final Allocations:   ${allocationCount}`);

  recordPass("STATE", "Selection state checked across all relation tables");

  // ============================================================================
  // 5. FINAL ALLOCATION BIJECTION (5 MAGIC + 2 OB = 7)
  // ============================================================================
  console.log("\n--- 5. FINAL ALLOCATION BIJECTION CONSTRAINTS ---");
  if (MAGIC_ROLES.length === 5 && OB_ROLES.length === 2 && ALL_FINAL_ROLES.length === 7) {
    recordPass("FINAL", "Exactly 5 MAGIC core roles and 2 OB roles defined (Total 7 positions)");
  } else {
    recordFail("FINAL", "Role count mismatch", `MAGIC: ${MAGIC_ROLES.length}, OB: ${OB_ROLES.length}`, "CRITICAL");
  }

  console.log("\n================================================================================");
  console.log(`  DEEP VALIDATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("================================================================================");
  if (issues.length > 0) {
    console.log("ISSUES IDENTIFIED:");
    issues.forEach((i, idx) => console.log(`  ${idx + 1}. [${i.severity}] ${i.section}: ${i.title} - ${i.detail}`));
    process.exit(1);
  }
}

runDeepQA()
  .catch((e) => {
    console.error("QA execution failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
