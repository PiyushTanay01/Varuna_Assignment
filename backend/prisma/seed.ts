import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- 1. CLEAR ALL DATA ---
  // We must delete in the correct order
  await prisma.poolMember.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.bankEntry.deleteMany();
  await prisma.shipCompliance.deleteMany();
  await prisma.route.deleteMany();

  console.log('Old data cleared.');

  // --- 2. CREATE ROUTES ---

  // Create one baseline route
  await prisma.route.create({
    data: {
      route_id: 'R1000',
      year: 2025,
      ghg_intensity: 91.16, // The 2020 baseline
      is_baseline: true,
      vesselType: 'Container Ship',
      fuelType: 'HFO',
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 15500,
    },
  });

  // Create other comparison routes
  const routesData = [
    {
      route_id: 'R1001', // SURPLUS SHIP
      year: 2025,
      ghg_intensity: 88.5, // Compliant (Surplus: +164.6M)
      is_baseline: false,
      vesselType: 'Container Ship',
      fuelType: 'LNG',
      fuelConsumption: 4800,
      distance: 12000,
      totalEmissions: 14000,
    },
    {
      route_id: 'R1002', // DEFICIT SHIP (FIXED)
      year: 2025,
      ghg_intensity: 92.3, // Not compliant
      is_baseline: false,
      vesselType: 'Bulker',
      fuelType: 'MGO',
      fuelConsumption: 600, // <-- REDUCED from 6000 (Deficit is now: -72.8M)
      distance: 10000,
      totalEmissions: 1800, // Reduced from 18000
    },
    {
      route_id: 'R1003',
      year: 2024,
      ghg_intensity: 91.8,
      is_baseline: false,
      vesselType: 'Tanker',
      fuelType: 'HFO',
      fuelConsumption: 7000,
      distance: 15000,
      totalEmissions: 21000,
    },
    {
      route_id: 'R1004',
      year: 2025,
      ghg_intensity: 89.1, // Just compliant
      is_baseline: false,
      vesselType: 'Tanker',
      fuelType: 'Methanol',
      fuelConsumption: 6500,
      distance: 14000,
      totalEmissions: 17000,
    },
  ];

  await prisma.route.createMany({
    data: routesData,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });