import request from 'supertest';
import app from '../app';
import { prisma } from './setup';
import bcrypt from 'bcryptjs';

describe('Product Routes', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Create a test user and get token
    const hashedPassword = await bcrypt.hash('Password123', 12);
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      },
    });

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'Password123',
      });

    authToken = loginResponse.body.data.token;
    userId = user.id;
  });

  describe('POST /api/products', () => {
    it('should create a product successfully', async () => {
      const productData = {
        name: 'MacBook Pro',
        brand: 'Apple',
        type: 'Laptop',
        warrantyPeriod: 12,
        startDate: '2023-01-01',
        description: 'High-performance laptop',
        serialNumber: 'MBP-001',
        purchasePrice: 2499.99,
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product created successfully');
      expect(response.body.data).toMatchObject({
        name: productData.name,
        brand: productData.brand,
        type: productData.type,
        warrantyPeriod: productData.warrantyPeriod,
        serialNumber: productData.serialNumber,
        purchasePrice: productData.purchasePrice,
      });

      // Verify product was created in database
      const product = await prisma.product.findFirst({
        where: { serialNumber: productData.serialNumber },
      });
      expect(product).toBeTruthy();
      expect(product?.userId).toBe(userId);
    });

    it('should fail to create product without authentication', async () => {
      const productData = {
        name: 'MacBook Pro',
        brand: 'Apple',
        type: 'Laptop',
        warrantyPeriod: 12,
        startDate: '2023-01-01',
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should fail to create product with invalid data', async () => {
      const productData = {
        name: '', // Invalid: empty name
        brand: 'Apple',
        type: 'Laptop',
        warrantyPeriod: 12,
        startDate: 'invalid-date', // Invalid date
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should fail to create product with duplicate serial number', async () => {
      const productData = {
        name: 'MacBook Pro',
        brand: 'Apple',
        type: 'Laptop',
        warrantyPeriod: 12,
        startDate: '2023-01-01',
        serialNumber: 'MBP-001',
      };

      // Create first product
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201);

      // Try to create second product with same serial number
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product with this serial number already exists');
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create test products
      await prisma.product.createMany({
        data: [
          {
            name: 'MacBook Pro',
            brand: 'Apple',
            type: 'Laptop',
            warrantyPeriod: 12,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2024-01-01'),
            userId,
          },
          {
            name: 'iPhone 15',
            brand: 'Apple',
            type: 'Smartphone',
            warrantyPeriod: 24,
            startDate: new Date('2023-09-01'),
            endDate: new Date('2025-09-01'),
            userId,
          },
        ],
      });
    });

    it('should get products successfully', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Products retrieved successfully');
      expect(response.body.data.data).toHaveLength(2);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should get products with pagination', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.data).toHaveLength(1);
      expect(response.body.data.pagination).toMatchObject({
        page: 1,
        limit: 1,
        total: 2,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      });
    });
  });

  describe('GET /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await prisma.product.create({
        data: {
          name: 'MacBook Pro',
          brand: 'Apple',
          type: 'Laptop',
          warrantyPeriod: 12,
          startDate: new Date('2023-01-01'),
          endDate: new Date('2024-01-01'),
          userId,
        },
      });
      productId = product.id;
    });

    it('should get product by id successfully', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product retrieved successfully');
      expect(response.body.data.id).toBe(productId);
    });

    it('should fail to get non-existent product', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await prisma.product.create({
        data: {
          name: 'MacBook Pro',
          brand: 'Apple',
          type: 'Laptop',
          warrantyPeriod: 12,
          startDate: new Date('2023-01-01'),
          endDate: new Date('2024-01-01'),
          userId,
        },
      });
      productId = product.id;
    });

    it('should update product successfully', async () => {
      const updateData = {
        name: 'MacBook Pro Updated',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product updated successfully');
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.description).toBe(updateData.description);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      const product = await prisma.product.create({
        data: {
          name: 'MacBook Pro',
          brand: 'Apple',
          type: 'Laptop',
          warrantyPeriod: 12,
          startDate: new Date('2023-01-01'),
          endDate: new Date('2024-01-01'),
          userId,
        },
      });
      productId = product.id;
    });

    it('should delete product successfully', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product deleted successfully');

      // Verify product was deleted
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      expect(product).toBeNull();
    });
  });

  describe('GET /api/products/stats', () => {
    beforeEach(async () => {
      // Create test products with different statuses
      await prisma.product.createMany({
        data: [
          {
            name: 'Product 1',
            brand: 'Brand 1',
            type: 'Type 1',
            warrantyPeriod: 12,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2024-01-01'),
            status: 'ACTIVE',
            userId,
          },
          {
            name: 'Product 2',
            brand: 'Brand 2',
            type: 'Type 2',
            warrantyPeriod: 12,
            startDate: new Date('2022-01-01'),
            endDate: new Date('2023-01-01'),
            status: 'EXPIRED',
            userId,
          },
        ],
      });
    });

    it('should get product stats successfully', async () => {
      const response = await request(app)
        .get('/api/products/stats')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Product statistics retrieved successfully');
      expect(response.body.data).toMatchObject({
        total: 2,
        active: 1,
        expired: 1,
        claimed: 0,
        cancelled: 0,
      });
    });
  });
});
