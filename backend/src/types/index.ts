import { Request } from 'express';
import { User, Product, ProductStatus } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface CreateProductRequest {
  name: string;
  brand: string;
  type: string;
  warrantyPeriod: number;
  startDate: string;
  description?: string;
  serialNumber?: string;
  purchasePrice?: number;
}

export interface UpdateProductRequest {
  name?: string;
  brand?: string;
  type?: string;
  warrantyPeriod?: number;
  startDate?: string;
  description?: string;
  serialNumber?: string;
  purchasePrice?: number;
  status?: ProductStatus;
}

export interface ProductWithUser extends Product {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}
