import { PrismaClient, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: hashedPassword,
    },
  });

  console.log('✅ Created users:', { user1: user1.email, user2: user2.email });

  // Create sample products
  const products = [
    {
      name: 'MacBook Pro 16"',
      brand: 'Apple',
      type: 'Laptop',
      warrantyPeriod: 12,
      startDate: new Date('2023-01-15'),
      endDate: new Date('2024-01-15'),
      description: 'High-performance laptop for professional use',
      serialNumber: 'MBP16-2023-001',
      purchasePrice: 2499.99,
      status: ProductStatus.ACTIVE,
      userId: user1.id,
    },
    {
      name: 'iPhone 15 Pro',
      brand: 'Apple',
      type: 'Smartphone',
      warrantyPeriod: 24,
      startDate: new Date('2023-09-20'),
      endDate: new Date('2025-09-20'),
      description: 'Latest iPhone with advanced camera system',
      serialNumber: 'IP15P-2023-002',
      purchasePrice: 999.99,
      status: ProductStatus.ACTIVE,
      userId: user1.id,
    },
    {
      name: 'Samsung Galaxy S24',
      brand: 'Samsung',
      type: 'Smartphone',
      warrantyPeriod: 12,
      startDate: new Date('2024-01-10'),
      endDate: new Date('2025-01-10'),
      description: 'Android flagship smartphone',
      serialNumber: 'SGS24-2024-003',
      purchasePrice: 799.99,
      status: ProductStatus.ACTIVE,
      userId: user2.id,
    },
    {
      name: 'Dell XPS 13',
      brand: 'Dell',
      type: 'Laptop',
      warrantyPeriod: 36,
      startDate: new Date('2022-06-01'),
      endDate: new Date('2025-06-01'),
      description: 'Ultrabook with premium build quality',
      serialNumber: 'DXP13-2022-004',
      purchasePrice: 1299.99,
      status: ProductStatus.ACTIVE,
      userId: user2.id,
    },
    {
      name: 'Sony WH-1000XM5',
      brand: 'Sony',
      type: 'Headphones',
      warrantyPeriod: 12,
      startDate: new Date('2023-03-15'),
      endDate: new Date('2024-03-15'),
      description: 'Noise-canceling wireless headphones',
      serialNumber: 'SWH5-2023-005',
      purchasePrice: 399.99,
      status: ProductStatus.EXPIRED,
      userId: user1.id,
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { serialNumber: productData.serialNumber },
      update: {},
      create: productData,
    });
  }

  console.log('✅ Created sample products');

  // Get statistics
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const activeProducts = await prisma.product.count({
    where: { status: ProductStatus.ACTIVE },
  });

  console.log('📊 Database statistics:');
  console.log(`   Users: ${userCount}`);
  console.log(`   Products: ${productCount}`);
  console.log(`   Active Products: ${activeProducts}`);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
