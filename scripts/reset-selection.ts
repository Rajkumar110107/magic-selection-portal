import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('====================================================');
  console.log('  RESETTING SELECTION STATE TO ZERO (CLEAN SLATE)');
  console.log('====================================================\n');

  console.log('1. Purging all selection state tables...');
  await prisma.finalAllocation.deleteMany({});
  await prisma.teamObservationParticipant.deleteMany({});
  await prisma.teamObservation.deleteMany({});
  await prisma.evaluationScore.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.response.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.areaAssignment.deleteMany({});
  await prisma.auditLog.deleteMany({});

  console.log('2. Resetting candidate profile statuses to UNASSIGNED...');
  await prisma.candidateProfile.updateMany({
    data: {
      status: 'UNASSIGNED',
      adminNotes: null
    }
  });

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

  await prisma.auditLog.create({
    data: {
      userId: admin?.id || null,
      action: 'SYSTEM_RESET',
      details: JSON.stringify({
        resetAt: new Date().toISOString(),
        message: 'Selection state reset to zero. Candidate accounts, capability areas, case studies, and questions preserved.'
      })
    }
  });

  const candidateCount = await prisma.candidateProfile.count();
  const areaCount = await prisma.capabilityArea.count();
  const caseCount = await prisma.caseStudy.count();
  const questionCount = await prisma.question.count();

  console.log('\n[SUCCESS] Selection state reset complete.');
  console.log(`  Candidates:          ${candidateCount}`);
  console.log(`  Capability Areas:    ${areaCount}`);
  console.log(`  Case Studies:        ${caseCount}`);
  console.log(`  Questions:           ${questionCount}`);
  console.log(`  Area Assignments:    0`);
  console.log(`  Assessments:         0`);
  console.log(`  Evaluations:         0`);
  console.log(`  Final Allocations:   0\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
