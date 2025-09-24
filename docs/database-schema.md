# Database Schema Documentation

## Overview

The WarrantyIt application uses PostgreSQL as the primary database with Prisma as the ORM. The database schema is designed to support multiple users and their product warranties with proper relationships and indexing.

## Entity Relationship Diagram

```
┌─────────────────┐    1:N    ┌─────────────────┐
│      User       │◄─────────►│     Product     │
├─────────────────┤           ├─────────────────┤
│ id (PK)         │           │ id (PK)         │
│ email (UNIQUE)  │           │ name            │
│ name            │           │ brand           │
│ password        │           │ type            │
│ createdAt       │           │ warrantyPeriod  │
│ updatedAt       │           │ startDate       │
└─────────────────┘           │ endDate         │
                              │ description     │
                              │ serialNumber    │
                              │ purchasePrice   │
                              │ status          │
                              │ userId (FK)     │
                              │ createdAt       │
                              │ updatedAt       │
                              └─────────────────┘
```

## Tables

### Users Table

**Purpose**: Stores user account information for authentication and authorization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique identifier for the user |
| `email` | String | UNIQUE, NOT NULL | User's email address (used for login) |
| `name` | String | NOT NULL | User's full name |
| `password` | String | NOT NULL | Hashed password for authentication |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Account creation timestamp |
| `updatedAt` | DateTime | NOT NULL, AUTO UPDATE | Last modification timestamp |

**Indexes**:
- Primary key on `id`
- Unique index on `email`

### Products Table

**Purpose**: Stores product warranty information for each user.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | String (CUID) | PRIMARY KEY | Unique identifier for the product |
| `name` | String | NOT NULL | Product name |
| `brand` | String | NOT NULL | Product brand/manufacturer |
| `type` | String | NOT NULL | Product category/type |
| `warrantyPeriod` | Integer | NOT NULL | Warranty duration in months |
| `startDate` | DateTime | NOT NULL | Warranty start date |
| `endDate` | DateTime | NOT NULL | Calculated warranty end date |
| `description` | String | NULL | Optional product description |
| `serialNumber` | String | NULL, UNIQUE | Optional product serial number |
| `purchasePrice` | Decimal(10,2) | NULL | Optional purchase price |
| `status` | Enum | NOT NULL, DEFAULT 'ACTIVE' | Product warranty status |
| `userId` | String (CUID) | NOT NULL, FOREIGN KEY | Reference to user who owns the product |
| `createdAt` | DateTime | NOT NULL, DEFAULT now() | Product creation timestamp |
| `updatedAt` | DateTime | NOT NULL, AUTO UPDATE | Last modification timestamp |

**Indexes**:
- Primary key on `id`
- Foreign key index on `userId`
- Index on `status` for filtering
- Index on `startDate` for date range queries
- Index on `endDate` for expiration queries
- Unique index on `serialNumber` (when not null)

**Foreign Key Constraints**:
- `userId` references `users.id` with CASCADE DELETE

### Enums

#### ProductStatus

Defines the possible states of a product warranty:

- `ACTIVE` - Warranty is currently active
- `EXPIRED` - Warranty has expired
- `CLAIMED` - Warranty claim has been made
- `CANCELLED` - Warranty has been cancelled

## Data Relationships

### One-to-Many: User → Products

- Each user can have multiple products
- Each product belongs to exactly one user
- When a user is deleted, all their products are automatically deleted (CASCADE)

## Business Rules

### Product Warranty Calculation

The `endDate` is automatically calculated based on:
- `startDate` + `warrantyPeriod` (in months)

### Serial Number Uniqueness

- Serial numbers must be unique across all products
- Null values are allowed (not all products have serial numbers)
- Uniqueness is enforced at the database level

### Data Validation

#### User Data
- Email must be valid format
- Password must be hashed before storage
- Name must be between 2-50 characters

#### Product Data
- Warranty period must be between 1-120 months
- Start date cannot be in the future
- Start date cannot be more than 1 year in the past
- Purchase price must be positive (if provided)
- Serial number must be 3-50 characters (if provided)

## Performance Considerations

### Indexing Strategy

1. **Primary Keys**: All tables have CUID primary keys for better distribution
2. **Foreign Keys**: Indexed for efficient joins
3. **Query Patterns**: Additional indexes on commonly queried fields:
   - `products.status` - for filtering by warranty status
   - `products.startDate` - for date range queries
   - `products.endDate` - for expiration date queries
   - `users.email` - for login lookups

### Query Optimization

- Use pagination for large result sets
- Leverage indexes for filtering and sorting
- Consider composite indexes for complex queries

## Migration Strategy

The database uses Prisma migrations for schema changes:

1. **Development**: `npx prisma migrate dev`
2. **Production**: `npx prisma migrate deploy`
3. **Reset**: `npx prisma migrate reset` (development only)

## Seeding

The database includes a seeder that creates:
- 2 test users with hashed passwords
- 5 sample products with various statuses
- Realistic data for testing and development

Run seeding with: `npx prisma db seed`

## Security Considerations

1. **Password Hashing**: Uses bcrypt with salt rounds of 12
2. **Data Validation**: Input validation at both API and database levels
3. **Access Control**: Row-level security through user ownership
4. **SQL Injection**: Prevented through Prisma ORM parameterized queries


