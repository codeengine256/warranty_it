import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow, isAfter, isBefore, addMonths } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string | Date, formatStr: string = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isProductExpired(endDate: string | Date): boolean {
  return isBefore(new Date(endDate), new Date());
}

export function isProductExpiringSoon(endDate: string | Date, days: number = 30): boolean {
  const now = new Date();
  const expiryDate = new Date(endDate);
  const warningDate = addMonths(now, days / 30);
  
  return isAfter(expiryDate, now) && isBefore(expiryDate, warningDate);
}

export function calculateEndDate(startDate: string | Date, warrantyPeriod: number): Date {
  return addMonths(new Date(startDate), warrantyPeriod);
}

export function calculateDaysRemaining(endDate: string | Date): number {
  const now = new Date();
  const expiryDate = new Date(endDate);
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE':
      return 'text-success-600 bg-success-50 border-success-200';
    case 'EXPIRED':
      return 'text-error-600 bg-error-50 border-error-200';
    case 'CLAIMED':
      return 'text-warning-600 bg-warning-50 border-warning-200';
    case 'CANCELLED':
      return 'text-secondary-600 bg-secondary-50 border-secondary-200';
    default:
      return 'text-secondary-600 bg-secondary-50 border-secondary-200';
  }
}

export function getStatusBadgeVariant(status: string): 'success' | 'error' | 'warning' | 'secondary' {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'EXPIRED':
      return 'error';
    case 'CLAIMED':
      return 'warning';
    case 'CANCELLED':
      return 'secondary';
    default:
      return 'secondary';
  }
}

export function formatCurrency(amount: number | string | undefined): string {
  if (amount === undefined || amount === null) return 'N/A';
  const numAmount = typeof amount === 'string' ? Number(amount) : amount;
  if (isNaN(numAmount)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  }
}
