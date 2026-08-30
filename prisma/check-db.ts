import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const candidates = await prisma.candidateProfile.count();
  const areas = await prisma.capabilityArea.count();
  const cases = await prisma.caseStudy.count();
  const questions = await prisma.question.count();
  const assignments = await prisma.areaAssignment.count();
  const assessments = await prisma.assessment.count();

  console.log({
    users,
    candidates,
    areas,
    cases,
    questions,
    assignments,
    assessments,
  });

  const allCandidates = await prisma.candidateProfile.findMany({
    include: { user: true }
  });
  console.log('Sample candidate IDs:', allCandidates.map(c => ({ id: c.id, name: c.user?.name, email: c.user?.email })));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
