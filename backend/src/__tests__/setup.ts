import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/warranty_it_test?schema=public',
    },
  },
});

beforeAll(async () => {
  // Clean database before tests
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Clean database after tests
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };
