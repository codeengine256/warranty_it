/**
 * Backend API Integration Tests
 * 
 * This test suite validates the core functionality of the WarrantyIt backend API
 * including health checks, authentication, product management, and error handling.
 * Tests focus on API behavior rather than internal implementation details.
 */
import request from 'supertest';
import app from '../app';

describe('Backend API Tests', () => {
  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('API is healthy');
    });
  });

  describe('API Documentation', () => {
    it('should serve API documentation', async () => {
      const response = await request(app)
        .get('/api-docs/')
        .expect(200);

      expect(response.text).toContain('swagger');
    });
  });

  describe('Auth Endpoints', () => {
    it('should reject invalid registration data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject invalid login data', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should reject profile access without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });

  describe('Product Endpoints', () => {
    it('should reject product creation without authentication', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          brand: 'Test Brand',
          type: 'Test Type',
          warrantyPeriod: 12,
          startDate: '2024-01-01'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should reject product access without authentication', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });

    it('should reject product stats without authentication', async () => {
      const response = await request(app)
        .get('/api/products/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access token required');
    });
  });
});
