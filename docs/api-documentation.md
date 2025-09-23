# WarrantyIt API Documentation

## Overview

The WarrantyIt API is a RESTful service built with Node.js, Express, and TypeScript. It provides comprehensive endpoints for managing product warranties and user accounts.

## Base URL

- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-api-domain.com/api`

## Interactive Documentation

Access the complete interactive API documentation at:
- **Swagger UI**: `http://localhost:3001/api-docs`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | null,
  "error": string | null
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid or missing token |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit information is included in response headers

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### GET /auth/profile
Get current user profile (requires authentication).

### Products

#### GET /products
Get paginated list of user's products.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `sortBy` (optional): Sort field (name, brand, type, warrantyPeriod, startDate, endDate, createdAt, updatedAt)
- `sortOrder` (optional): Sort direction (asc, desc)

**Example:**
```http
GET /products?page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

#### POST /products
Create a new product.

**Request Body:**
```json
{
  "name": "MacBook Pro 16\"",
  "brand": "Apple",
  "type": "Laptop",
  "warrantyPeriod": 12,
  "startDate": "2023-01-15",
  "description": "High-performance laptop",
  "serialNumber": "MBP16-2023-001",
  "purchasePrice": 2499.99
}
```

#### GET /products/:id
Get specific product by ID.

#### PUT /products/:id
Update existing product.

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Product Name",
  "brand": "Apple",
  "type": "Laptop",
  "warrantyPeriod": 24,
  "startDate": "2023-01-15",
  "description": "Updated description",
  "serialNumber": "UPDATED-SERIAL",
  "purchasePrice": 2599.99,
  "status": "ACTIVE"
}
```

#### DELETE /products/:id
Delete product.

#### GET /products/stats
Get product statistics for the user.

**Response:**
```json
{
  "success": true,
  "message": "Product statistics retrieved successfully",
  "data": {
    "total": 25,
    "active": 20,
    "expired": 3,
    "claimed": 1,
    "cancelled": 1,
    "expiringSoon": 2
  }
}
```

### System

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## Data Models

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Product
```json
{
  "id": "string",
  "name": "string",
  "brand": "string",
  "type": "string",
  "warrantyPeriod": "integer (months)",
  "startDate": "datetime",
  "endDate": "datetime (calculated)",
  "description": "string (optional)",
  "serialNumber": "string (optional, unique)",
  "purchasePrice": "decimal (optional)",
  "status": "ACTIVE | EXPIRED | CLAIMED | CANCELLED",
  "userId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "user": "User object"
}
```

### ProductStats
```json
{
  "total": "integer",
  "active": "integer",
  "expired": "integer",
  "claimed": "integer",
  "cancelled": "integer",
  "expiringSoon": "integer"
}
```

## Validation Rules

### User Registration
- **name**: 2-50 characters
- **email**: Valid email format, unique
- **password**: Minimum 8 characters, must contain uppercase, lowercase, and number

### Product Creation/Update
- **name**: 2-100 characters
- **brand**: 2-50 characters
- **type**: 2-50 characters
- **warrantyPeriod**: 1-120 months
- **startDate**: Valid date, not in future, not more than 1 year ago
- **description**: Maximum 500 characters (optional)
- **serialNumber**: 3-50 characters, unique (optional)
- **purchasePrice**: Positive number (optional)

## Testing the API

### Using Swagger UI
1. Visit `http://localhost:3001/api-docs`
2. Click "Authorize" and enter your JWT token
3. Test endpoints directly in the browser

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123"
  }'
```

**Create a product:**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "MacBook Pro",
    "brand": "Apple",
    "type": "Laptop",
    "warrantyPeriod": 12,
    "startDate": "2023-01-15"
  }'
```

**Get products:**
```bash
curl -X GET http://localhost:3001/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## SDKs and Code Generation

The OpenAPI specification is available at:
- **JSON**: `http://localhost:3001/api-docs/swagger.json`
- **YAML**: `http://localhost:3001/api-docs/swagger.yaml`

You can use this to generate client SDKs for various languages using tools like:
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Swagger Codegen](https://swagger.io/tools/swagger-codegen/)

## Support

For API support and questions:
- Check the interactive documentation at `/api-docs`
- Review the error responses for specific error details
- Check the application logs for detailed error information
