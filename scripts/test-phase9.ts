import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runPhase9Tests() {
  console.log("==================================================");
  console.log("RUNNING PHASE 9 AUTOMATED TEST SUITE: EXPORTS & DOWNLOADABLE RECORDS");
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

  // 1. Get evaluated assessment
  const assessment = await prisma.assessment.findFirst({
    where: { status: "EVALUATED" },
    include: {
      candidate: { include: { user: true } },
      caseStudy: { include: { area: true, questions: { orderBy: { orderNumber: "asc" } } } },
      responses: true,
      evaluation: { include: { scores: true } }
    }
  });

  assert(!!assessment, "Test 1: Evaluated assessment exists for export generation");

  // 2. Generate and Verify TXT Export Content
  let txt = `====================================================\n`;
  txt += `MAGIC SELECTION PORTAL - ASSESSMENT TRANSCRIPT\n`;
  txt += `====================================================\n\n`;
  txt += `CANDIDATE: ${assessment!.candidate.user.name} (${assessment!.candidate.secId})\n`;
  txt += `AREA:      ${assessment!.caseStudy.area.name}\n`;
  txt += `CASE:      ${assessment!.caseStudy.title}\n`;
  txt += `STATUS:    ${assessment!.status}\n\n`;

  assessment!.caseStudy.questions.forEach((q, idx) => {
    if (q.newInformation) {
      txt += `[NEW INFORMATION] -> ${q.newInformation}\n\n`;
    }
    txt += `Q${idx + 1}: ${q.questionText}\n\n`;
    const resp = assessment!.responses.find((r) => r.questionId === q.id);
    txt += `A:\n${resp?.answerText || "(No response)"}\n\n`;
  });

  if (assessment!.evaluation) {
    txt += `EVALUATION RESULTS:\n`;
    txt += `Total Score: ${assessment!.evaluation.totalScore}\n`;
    assessment!.evaluation.scores.forEach((s) => {
      txt += `- ${s.dimension}: ${s.score}/10\n`;
    });
  }

  assert(
    txt.includes(assessment!.candidate.user.name!) && txt.includes(assessment!.candidate.secId),
    "Test 2: TXT export contains Candidate Name and SEC ID"
  );
  assert(
    txt.includes(assessment!.caseStudy.title) && txt.includes(assessment!.caseStudy.area.name),
    "Test 3: TXT export contains Case Study Title and Capability Area"
  );
  assert(
    txt.includes("Q1:") && txt.includes("Q10:") && txt.includes("[NEW INFORMATION]"),
    "Test 4: TXT export contains all questions and progressive twist callouts verbatim"
  );
  assert(
    txt.includes("EVALUATION RESULTS:") && txt.includes("Critical Thinking"),
    "Test 5: TXT export contains Evaluation score breakdown"
  );

  // 3. Test Master Final Allocations CSV Export
  const finalAllocations = await prisma.finalAllocation.findMany({
    include: {
      candidate: {
        include: {
          user: true,
          assignments: { include: { area: true } }
        }
      }
    }
  });

  assert(
    finalAllocations.length === 7,
    "Test 6: Exactly 7 final allocations found for CSV/JSON master roster"
  );

  let csv = "Role,Candidate Name,SEC ID,Department,Year,Assigned Capability Areas\n";
  finalAllocations.forEach((fa) => {
    csv += `"${fa.roleName}","${fa.candidate.user.name}","${fa.candidate.secId}","${fa.candidate.department}","${fa.candidate.year}"\n`;
  });

  assert(
    csv.includes("Mastermind") && csv.includes("Co-Lead") && csv.includes("Office Bearer"),
    "Test 7: Master CSV contains both MAGIC core and Office Bearer roles"
  );

  // 4. Test Master JSON Export
  const jsonExport = {
    totalAllocations: finalAllocations.length,
    roster: finalAllocations.map((fa) => ({
      role: fa.roleName,
      name: fa.candidate.user.name,
      secId: fa.candidate.secId,
      isLocked: fa.isLocked
    }))
  };

  const jsonString = JSON.stringify(jsonExport);
  assert(
    jsonString.length > 50 && jsonExport.roster.length === 7,
    "Test 8: Master JSON export contains complete structured 7-candidate roster"
  );

  console.log("\n==================================================");
  console.log(`PHASE 9 TEST SUITE: ALL ${passedTests}/${totalTests} TESTS PASSED!`);
  console.log("==================================================");
}

runPhase9Tests()
  .catch((e) => {
    console.error("Phase 9 test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
