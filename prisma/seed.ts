import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { caseStudies } from './data/cases';

const prisma = new PrismaClient();

const candidatesData = [
  { name: 'Subhasridharan R', secId: 'SEC25AD046', department: 'AI & Data Science', year: '2nd Year', section: '' },
  { name: 'Yeswant V', secId: 'SEC25CS048', department: 'CSE', year: '2nd Year', section: '' },
  { name: 'Harsha Rani R B', secId: 'SEC25CS346', department: 'CSE', year: '2nd Year', section: 'I' },
  { name: 'Dhayaa Shri S', secId: 'SEC25CS597', department: 'CSE', year: '2nd Year', section: 'A' },
  { name: 'Logapriya D', secId: 'SEC25IT137', department: 'IT', year: '2nd Year', section: '' },
  { name: 'Sathya Priya J', secId: 'SEC25CS353', department: 'CSE', year: '2nd Year', section: 'B' },
  { name: 'Kannan D', secId: 'SEC25AM173', department: 'CSE / AI-ML', year: '2nd Year', section: '' }
];

const capabilityAreasData = [
  {
    name: 'Strategic Thinking',
    hiddenRole: 'Mastermind',
    description: 'Evaluates long-term vision, systems thinking, high-level roadmapping, and foresight in complex problem domains.',
    isActive: true
  },
  {
    name: 'Decision-Making & Representation',
    hiddenRole: 'Advocate',
    description: 'Evaluates ethical judgment, objective assessment, stakeholder representation, and sound crisis judgment.',
    isActive: true
  },
  {
    name: 'Mentoring & Problem-Solving',
    hiddenRole: 'Guide',
    description: 'Evaluates empathetic coaching, peer support, conflict resolution, and technical problem enablement.',
    isActive: true
  },
  {
    name: 'Research & Observation',
    hiddenRole: 'Investigator',
    description: 'Evaluates structured inquiry, data-driven analysis, root cause discovery, and thorough background observation.',
    isActive: true
  },
  {
    name: 'Communication & Influence',
    hiddenRole: 'Communicator',
    description: 'Evaluates storytelling, community influence, public advocacy, narrative alignment, and transparent leadership.',
    isActive: true
  },
  {
    name: 'Execution & Responsibility',
    hiddenRole: 'Office Bearer',
    description: 'Evaluates operational discipline, ownership, accountability, task management, and consistent delivery.',
    isActive: true
  }
];

async function main() {
  console.log('====================================================');
  console.log('  MAGIC SELECTION PORTAL — PRODUCTION SEED INITIALIZATION');
  console.log('====================================================\n');

  // 1. Purge all prior selection state to guarantee clean initial production state
  console.log('1. Purging all historical selection/test state...');
  await prisma.finalAllocation.deleteMany({});
  await prisma.teamObservationParticipant.deleteMany({});
  await prisma.teamObservation.deleteMany({});
  await prisma.evaluationScore.deleteMany({});
  await prisma.evaluation.deleteMany({});
  await prisma.response.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.areaAssignment.deleteMany({});
  await prisma.auditLog.deleteMany({});
  console.log('   -> Selection state successfully purged.');

  // 2. Configure Admin Account
  console.log('\n2. Configuring Admin Account...');
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@magic.com').trim().toLowerCase();
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminPasswordHash = await bcrypt.hash(adminRawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPasswordHash,
      role: 'ADMIN',
      name: 'Admin User'
    },
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: adminPasswordHash,
      role: 'ADMIN'
    }
  });
  console.log(`   -> Admin user ready: ${admin.email} (Role: ${admin.role})`);

  // 3. Configure Capability Areas
  console.log('\n3. Configuring Capability Areas...');
  for (const area of capabilityAreasData) {
    await prisma.capabilityArea.upsert({
      where: { name: area.name },
      update: {
        hiddenRole: area.hiddenRole,
        description: area.description,
        isActive: area.isActive
      },
      create: {
        name: area.name,
        hiddenRole: area.hiddenRole,
        description: area.description,
        isActive: area.isActive
      }
    });
  }
  console.log(`   -> 6 Capability Areas configured.`);

  // 4. Configure 7 Real Candidates
  console.log('\n4. Configuring 7 Real Candidate Accounts...');
  const candidateRawPassword = process.env.CANDIDATE_DEFAULT_PASSWORD || 'password123';
  const candidatePasswordHash = await bcrypt.hash(candidateRawPassword, 10);

  for (const candidate of candidatesData) {
    const candidateEmail = `${candidate.secId.toLowerCase()}@student.sec.ac.in`;

    const user = await prisma.user.upsert({
      where: { email: candidateEmail },
      update: {
        name: candidate.name,
        password: candidatePasswordHash,
        role: 'CANDIDATE'
      },
      create: {
        name: candidate.name,
        email: candidateEmail,
        password: candidatePasswordHash,
        role: 'CANDIDATE',
        candidateProfile: {
          create: {
            secId: candidate.secId,
            department: candidate.department,
            year: candidate.year,
            section: candidate.section || null,
            status: 'UNASSIGNED',
            adminNotes: null
          }
        }
      }
    });

    // Ensure CandidateProfile exists with clean UNASSIGNED status
    await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      update: {
        secId: candidate.secId,
        department: candidate.department,
        year: candidate.year,
        section: candidate.section || null,
        status: 'UNASSIGNED',
        adminNotes: null
      },
      create: {
        userId: user.id,
        secId: candidate.secId,
        department: candidate.department,
        year: candidate.year,
        section: candidate.section || null,
        status: 'UNASSIGNED',
        adminNotes: null
      }
    });

    console.log(`   -> Candidate ready: ${candidate.name} (${candidate.secId})`);
  }

  // 5. Clean & Re-populate Case Studies & Questions
  console.log('\n5. Populating 18 Case Studies and 180 Questions...');
  await prisma.question.deleteMany({});
  await prisma.caseStudy.deleteMany({});

  let caseCount = 0;
  let questionCount = 0;

  for (const areaData of caseStudies) {
    const area = await prisma.capabilityArea.findUnique({ where: { name: areaData.area } });
    if (!area) continue;

    for (const caseData of areaData.cases) {
      const createdCase = await prisma.caseStudy.create({
        data: {
          capabilityAreaId: area.id,
          code: caseData.code,
          title: caseData.title,
          shortDescription: caseData.shortDescription,
          background: caseData.background,
          currentSituation: caseData.currentSituation,
          stakeholders: JSON.stringify(caseData.stakeholders),
          knownInformation: JSON.stringify(caseData.knownInformation),
          constraints: JSON.stringify(caseData.constraints),
          hiddenDetails: caseData.hiddenDetails,
          initialChallenge: caseData.initialChallenge,
          finalDecisionChallenge: caseData.finalDecisionChallenge,
          assessmentCompetencies: JSON.stringify(caseData.assessmentCompetencies),
          difficultyLevel: caseData.difficultyLevel,
          version: caseData.version,
          context: caseData.context,
          isActive: true,
        }
      });
      caseCount++;

      for (const q of caseData.questions) {
        await prisma.question.create({
          data: {
            caseStudyId: createdCase.id,
            orderNumber: q.orderNumber,
            questionText: q.questionText,
            newInformation: q.newInformation || null,
            competencyTested: q.competencyTested || null,
            guidance: q.guidance || null,
          }
        });
        questionCount++;
      }
    }
  }

  // 6. Record System Initialization Audit Entry
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INITIALIZED',
      details: JSON.stringify({
        initializedAt: new Date().toISOString(),
        message: 'Production database initialized with 1 Admin, 7 Candidates, 6 Areas, 18 Cases, 180 Questions. Zero active selection state.'
      })
    }
  });

  console.log('\n====================================================');
  console.log('  PRODUCTION SEED COMPLETED SUCCESSFULLY');
  console.log('====================================================');
  console.log(`  Admin Accounts:      1`);
  console.log(`  Real Candidates:     ${candidatesData.length}`);
  console.log(`  Capability Areas:    ${capabilityAreasData.length}`);
  console.log(`  Case Studies:        ${caseCount} (3 per area)`);
  console.log(`  Questions:           ${questionCount} (10 per case)`);
  console.log(`  Area Assignments:    0 (Unassigned)`);
  console.log(`  Assessments:         0`);
  console.log(`  Evaluations:         0`);
  console.log(`  Final Allocations:   0`);
  console.log('====================================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
