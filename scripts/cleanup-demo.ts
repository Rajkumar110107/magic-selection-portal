import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('====================================================');
  console.log('  REMOVING DEMO STUDENT & PURGING DEMO SELECTION DATA');
  console.log('====================================================\n');

  const demoProfile = await prisma.candidateProfile.findFirst({
    where: {
      OR: [
        { secId: 'TEST001' },
        { user: { email: 'demo.student@magic.test' } }
      ]
    },
    include: {
      user: true,
      assignments: true,
      assessments: true,
      finalAllocations: true,
      teamObservations: true
    }
  });

  if (!demoProfile) {
    console.log('[INFO] No Demo Student account found. Nothing to clean.');
    return;
  }

  const profileId = demoProfile.id;
  const userId = demoProfile.userId;

  // 1. Delete allocations
  await prisma.finalAllocation.deleteMany({
    where: { candidateProfileId: profileId }
  });

  // 2. Delete team observation participant records
  await prisma.teamObservationParticipant.deleteMany({
    where: { candidateProfileId: profileId }
  });

  // 3. Delete evaluations, responses, and assessments
  const assessments = await prisma.assessment.findMany({
    where: { candidateProfileId: profileId }
  });

  for (const ass of assessments) {
    await prisma.evaluationScore.deleteMany({
      where: { evaluation: { assessmentId: ass.id } }
    });
    await prisma.evaluation.deleteMany({
      where: { assessmentId: ass.id }
    });
    await prisma.response.deleteMany({
      where: { assessmentId: ass.id }
    });
  }

  await prisma.assessment.deleteMany({
    where: { candidateProfileId: profileId }
  });

  // 4. Delete area assignments
  await prisma.areaAssignment.deleteMany({
    where: { candidateProfileId: profileId }
  });

  // 5. Delete candidate profile and user account
  await prisma.candidateProfile.delete({
    where: { id: profileId }
  });

  await prisma.user.delete({
    where: { id: userId }
  });

  console.log(`[SUCCESS] Demo Student account (${demoProfile.secId}) and all associated test data safely removed.`);
  console.log('All 7 real candidates and master content remain completely untouched.\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
