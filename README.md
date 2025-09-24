# WarrantyIt - Product Warranty Management System

A full-stack web application for managing product warranties with a modern, responsive UI and robust backend API.

## 🎥 Demo

Watch the application in action: [WarrantyIt Demo Video](https://www.loom.com/share/39eb168f7b7b45f5925933a5a651ae36?sid=8bbd662a-5226-4937-8634-693a89e83782)

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Management**: Add, edit, delete, and view product warranties
- **Warranty Tracking**: Monitor warranty status and expiration dates
- **Dashboard Analytics**: Visual statistics and insights
- **Search & Filtering**: Find products quickly with advanced filters
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **Modern UI/UX**: Beautiful, accessible interface with Tailwind CSS
- **State Management**: Zustand for predictable state management
- **Real-time Updates**: Instant UI updates with optimistic updates
- **Comprehensive Testing**: Unit and integration tests for reliability
- **Production Ready**: Logging, error handling, and security best practices

## 🏗️ Architecture

### Monorepo Structure
```
WarrantyIt/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── routes/          # API endpoints
│   │   ├── types/           # TypeScript definitions
│   │   └── __tests__/       # Backend tests
│   ├── prisma/              # Database schema and migrations
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── store/           # Redux store and slices
│   │   ├── lib/             # Utilities and API client
│   │   └── test/            # Frontend tests
│   └── package.json
├── docs/                    # Documentation
└── package.json             # Root package.json for scripts
```

### Technology Stack

#### Backend
- **Node.js** with **Express.js** - Server framework
- **TypeScript** - Type safety and better development experience
- **PostgreSQL** - Relational database
- **Prisma** - Modern ORM with migrations and seeding
- **JWT** - Authentication and authorization
- **Winston** - Structured logging
- **Morgan** - HTTP request logging
- **Jest** - Testing framework
- **bcryptjs** - Password hashing

#### Frontend
- **React 18** - UI library with hooks
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- PostgreSQL 13+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codeengine256/warranty_it.git
   cd WarrantyIt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   
   # Frontend
   cp frontend/env.example frontend/.env
   ```

4. **Configure database**
   ```bash
   # Update backend/.env with your PostgreSQL connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/warranty_it?schema=public"
   ```

5. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed the database
   npm run db:seed
   ```

6. **Start the development servers**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start individually
   npm run dev:backend   # Backend on http://localhost:3001
   npm run dev:frontend  # Frontend on http://localhost:3000
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - API Health Check: http://localhost:3001/health
   - **API Documentation (Swagger)**: http://localhost:3001/api-docs

## 📚 API Documentation

### Interactive API Documentation

The API includes comprehensive Swagger/OpenAPI documentation that you can access at:
- **Development**: http://localhost:3001/api-docs
- **Production**: https://your-api-domain.com/api-docs

The Swagger UI provides:
- ✅ Interactive API testing
- ✅ Complete endpoint documentation
- ✅ Request/response examples
- ✅ Authentication testing
- ✅ Schema definitions
- ✅ Error code documentation

### Authentication Endpoints

#### POST /api/auth/register
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
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST /api/auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

### Product Endpoints

#### GET /api/products
Get paginated list of user's products.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field
- `sortOrder` (optional): Sort direction (asc/desc)

#### POST /api/products
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

#### GET /api/products/:id
Get specific product by ID.

#### PUT /api/products/:id
Update existing product.

#### DELETE /api/products/:id
Delete product.

#### GET /api/products/stats
Get product statistics for the user.

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
npm run test:backend

# Run tests in watch mode
npm run test:backend:watch

# Run tests with coverage
cd backend && npm run test:coverage
```

### Frontend Tests
```bash
# Run all tests
npm run test:frontend

# Run tests in watch mode
npm run test:frontend:watch

# Run tests with UI
npm run test:ui
```

### Test Coverage
- Backend: Comprehensive API endpoint testing
- Frontend: Component and hook testing
- Integration: End-to-end user flows

## 🚀 Deployment

### Production Build
```bash
# Build both applications
npm run build

# Build individually
npm run build:backend
npm run build:frontend
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.com"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_URL="https://your-backend-domain.com/api"
```

### Docker Deployment (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts with authentication
- **Products**: Product warranty information
- **Relationships**: One-to-many (User → Products)

See [Database Schema Documentation](docs/database-schema.md) for detailed information.

## 🔧 Development

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks for quality checks

### Available Scripts

#### Root Level
```bash
npm run dev              # Start both backend and frontend
npm run build            # Build both applications
npm run test             # Run all tests
npm run lint             # Lint all code
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed the database
```

#### Backend
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Lint code
npm run db:studio        # Open Prisma Studio
```

#### Frontend
```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests
npm run test:ui          # Run tests with UI
npm run lint             # Lint code
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
