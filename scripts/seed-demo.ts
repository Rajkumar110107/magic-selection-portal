import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('====================================================');
  console.log('  SEEDING DEMO / TEST CANDIDATE FOR POST-DEPLOY QA');
  console.log('====================================================\n');

  const demoSecId = 'TEST001';
  const demoEmail = 'demo.student@magic.test';
  const demoName = 'Demo Student (Sandbox)';
  const demoRawPassword = process.env.DEMO_STUDENT_PASSWORD || 'demo123';
  const demoPasswordHash = await bcrypt.hash(demoRawPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {
      name: demoName,
      password: demoPasswordHash,
      role: 'CANDIDATE'
    },
    create: {
      name: demoName,
      email: demoEmail,
      password: demoPasswordHash,
      role: 'CANDIDATE',
      candidateProfile: {
        create: {
          secId: demoSecId,
          department: 'QA & Testing Sandbox',
          year: 'Demo Mode',
          section: 'TEST',
          status: 'UNASSIGNED',
          adminNotes: 'TEMPORARY DEMO ACCOUNT: For post-deployment verification only. Delete before live selection using npm run cleanup:demo.'
        }
      }
    }
  });

  await prisma.candidateProfile.upsert({
    where: { userId: user.id },
    update: {
      secId: demoSecId,
      department: 'QA & Testing Sandbox',
      year: 'Demo Mode',
      section: 'TEST',
      status: 'UNASSIGNED',
      adminNotes: 'TEMPORARY DEMO ACCOUNT: For post-deployment verification only. Delete before live selection using npm run cleanup:demo.'
    },
    create: {
      userId: user.id,
      secId: demoSecId,
      department: 'QA & Testing Sandbox',
      year: 'Demo Mode',
      section: 'TEST',
      status: 'UNASSIGNED',
      adminNotes: 'TEMPORARY DEMO ACCOUNT: For post-deployment verification only. Delete before live selection using npm run cleanup:demo.'
    }
  });

  console.log(`[SUCCESS] Demo Student created:`);
  console.log(`  Name:       ${demoName}`);
  console.log(`  SEC ID:     ${demoSecId}`);
  console.log(`  Email:      ${demoEmail}`);
  console.log(`  Login identifier: TEST001 or ${demoEmail}`);
  console.log('\nUse "npm run cleanup:demo" after testing to remove this account and all demo data.\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
