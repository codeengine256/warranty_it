import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'WarrantyIt API',
    version: '1.0.0',
    description: 'A comprehensive API for managing product warranties and user accounts',
    contact: {
      name: 'WarrantyIt Support',
      email: 'support@warrantyit.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://api.warrantyit.com' 
        : 'http://localhost:3001',
      description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique user identifier',
            example: 'clr1234567890abcdef',
          },
          name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'User last update timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique product identifier',
            example: 'clr1234567890abcdef',
          },
          name: {
            type: 'string',
            description: 'Product name',
            example: 'MacBook Pro 16"',
          },
          brand: {
            type: 'string',
            description: 'Product brand',
            example: 'Apple',
          },
          type: {
            type: 'string',
            description: 'Product type/category',
            example: 'Laptop',
          },
          warrantyPeriod: {
            type: 'integer',
            description: 'Warranty period in months',
            example: 12,
            minimum: 1,
            maximum: 120,
          },
          startDate: {
            type: 'string',
            format: 'date-time',
            description: 'Warranty start date',
            example: '2023-01-15T00:00:00.000Z',
          },
          endDate: {
            type: 'string',
            format: 'date-time',
            description: 'Warranty end date (calculated)',
            example: '2024-01-15T00:00:00.000Z',
          },
          description: {
            type: 'string',
            description: 'Product description',
            example: 'High-performance laptop for professional use',
            nullable: true,
          },
          serialNumber: {
            type: 'string',
            description: 'Product serial number',
            example: 'MBP16-2023-001',
            nullable: true,
          },
          purchasePrice: {
            type: 'number',
            format: 'decimal',
            description: 'Product purchase price',
            example: 2499.99,
            nullable: true,
          },
          status: {
            type: 'string',
            enum: ['ACTIVE', 'EXPIRED', 'CLAIMED', 'CANCELLED'],
            description: 'Product warranty status',
            example: 'ACTIVE',
          },
          userId: {
            type: 'string',
            description: 'Owner user ID',
            example: 'clr1234567890abcdef',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Product creation timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Product last update timestamp',
            example: '2023-01-01T00:00:00.000Z',
          },
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      ProductStats: {
        type: 'object',
        properties: {
          total: {
            type: 'integer',
            description: 'Total number of products',
            example: 25,
          },
          active: {
            type: 'integer',
            description: 'Number of active warranties',
            example: 20,
          },
          expired: {
            type: 'integer',
            description: 'Number of expired warranties',
            example: 3,
          },
          claimed: {
            type: 'integer',
            description: 'Number of claimed warranties',
            example: 1,
          },
          cancelled: {
            type: 'integer',
            description: 'Number of cancelled warranties',
            example: 1,
          },
          expiringSoon: {
            type: 'integer',
            description: 'Number of warranties expiring in next 30 days',
            example: 2,
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indicates if the request was successful',
            example: true,
          },
          message: {
            type: 'string',
            description: 'Response message',
            example: 'Operation completed successfully',
          },
          data: {
            type: 'object',
            description: 'Response data (varies by endpoint)',
          },
          error: {
            type: 'string',
            description: 'Error message (only present when success is false)',
            example: 'Validation failed',
          },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Product',
            },
            description: 'Array of products',
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                description: 'Current page number',
                example: 1,
              },
              limit: {
                type: 'integer',
                description: 'Number of items per page',
                example: 10,
              },
              total: {
                type: 'integer',
                description: 'Total number of items',
                example: 100,
              },
              totalPages: {
                type: 'integer',
                description: 'Total number of pages',
                example: 10,
              },
              hasNext: {
                type: 'boolean',
                description: 'Whether there is a next page',
                example: true,
              },
              hasPrev: {
                type: 'boolean',
                description: 'Whether there is a previous page',
                example: false,
              },
            },
          },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Validation failed',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: {
                  type: 'string',
                  example: 'email',
                },
                message: {
                  type: 'string',
                  example: 'Please provide a valid email',
                },
                value: {
                  type: 'string',
                  example: 'invalid-email',
                },
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);
