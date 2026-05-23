const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Admin User
  // Username: Admin, Password: Save_@raj05
  const username = 'Admin';
  const plainPassword = 'Save_@raj05';
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  // Clean old users and insert new one
  await prisma.user.deleteMany({});
  const admin = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Created admin user: ${admin.username}`);

  // 2. Prepopulate Default Fee Structures
  await prisma.feeStructure.deleteMany({});

  const classes = [
    { classLevel: 'Nursery', tuitionFee: 2000, admissionFee: 5000, developmentFee: 1500, annualCharges: 3000 },
    { classLevel: 'LKG', tuitionFee: 2200, admissionFee: 5000, developmentFee: 1500, annualCharges: 3000 },
    { classLevel: 'UKG', tuitionFee: 2200, admissionFee: 5000, developmentFee: 1500, annualCharges: 3000 },
    { classLevel: 'Class 1', tuitionFee: 2500, admissionFee: 6000, developmentFee: 2000, annualCharges: 3500 },
    { classLevel: 'Class 2', tuitionFee: 2500, admissionFee: 6000, developmentFee: 2000, annualCharges: 3500 },
    { classLevel: 'Class 3', tuitionFee: 2700, admissionFee: 6000, developmentFee: 2000, annualCharges: 3500 },
    { classLevel: 'Class 4', tuitionFee: 2700, admissionFee: 6000, developmentFee: 2000, annualCharges: 3500 },
    { classLevel: 'Class 5', tuitionFee: 3000, admissionFee: 6000, developmentFee: 2000, annualCharges: 3500 },
    { classLevel: 'Class 6', tuitionFee: 3200, admissionFee: 7000, developmentFee: 2500, annualCharges: 4000 },
    { classLevel: 'Class 7', tuitionFee: 3200, admissionFee: 7000, developmentFee: 2500, annualCharges: 4000 },
    { classLevel: 'Class 8', tuitionFee: 3500, admissionFee: 7000, developmentFee: 2500, annualCharges: 4000 },
    { classLevel: 'Class 9', tuitionFee: 4000, admissionFee: 8000, developmentFee: 3000, annualCharges: 4500 },
    { classLevel: 'Class 10', tuitionFee: 4200, admissionFee: 8000, developmentFee: 3000, annualCharges: 4500 },
    { classLevel: 'Class 11 Science', tuitionFee: 5000, admissionFee: 10000, developmentFee: 3500, annualCharges: 5000 },
    { classLevel: 'Class 11 Commerce', tuitionFee: 4500, admissionFee: 9000, developmentFee: 3500, annualCharges: 4500 },
    { classLevel: 'Class 11 Humanities', tuitionFee: 4200, admissionFee: 8000, developmentFee: 3500, annualCharges: 4000 },
    { classLevel: 'Class 12 Science', tuitionFee: 5200, admissionFee: 10000, developmentFee: 3500, annualCharges: 5000 },
    { classLevel: 'Class 12 Commerce', tuitionFee: 4700, admissionFee: 9000, developmentFee: 3500, annualCharges: 4500 },
    { classLevel: 'Class 12 Humanities', tuitionFee: 4400, admissionFee: 8000, developmentFee: 3500, annualCharges: 4000 }
  ];

  let totalCount = 0;

  // Insert English Medium Records
  for (const c of classes) {
    await prisma.feeStructure.create({
      data: {
        ...c,
        medium: 'English'
      }
    });
    totalCount++;
  }

  // Insert Hindi Medium Records (Slightly discounted pricing model)
  for (const c of classes) {
    await prisma.feeStructure.create({
      data: {
        classLevel: c.classLevel,
        medium: 'Hindi',
        tuitionFee: Math.round(c.tuitionFee * 0.8 / 100) * 100, // 20% discount rounded to nearest 100
        admissionFee: Math.round(c.admissionFee * 0.85 / 100) * 100, // 15% discount
        developmentFee: Math.round(c.developmentFee * 0.8 / 100) * 100,
        annualCharges: Math.round(c.annualCharges * 0.85 / 100) * 100
      }
    });
    totalCount++;
  }

  console.log(`Prepopulated ${totalCount} fee structure records (English & Hindi Mediums).`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
