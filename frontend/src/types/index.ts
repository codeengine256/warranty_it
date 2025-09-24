export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  type: string;
  warrantyPeriod: number;
  startDate: string;
  endDate: string;
  description?: string;
  serialNumber?: string;
  purchasePrice?: number | string; // Can be number or string from API
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export type ProductStatus = 'ACTIVE' | 'EXPIRED' | 'CLAIMED' | 'CANCELLED';

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
  user: User;
  token: string;
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
  status?: string;
  search?: string;
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

export interface ProductStats {
  total: number;
  active: number;
  expired: number;
  claimed: number;
  cancelled: number;
  expiringSoon: number;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginatedResponse<T>['pagination'];
  onPageChange?: (page: number) => void;
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
