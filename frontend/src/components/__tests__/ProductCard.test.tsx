import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProductCard from '../products/ProductCard';
import { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'MacBook Pro',
  brand: 'Apple',
  type: 'Laptop',
  warrantyPeriod: 12,
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2026-01-01T00:00:00Z', // Future date to show as ACTIVE
  description: 'High-performance laptop',
  serialNumber: 'MBP-001',
  purchasePrice: 2499.99,
  status: 'ACTIVE',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  },
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    expect(screen.getByText('Apple • Laptop')).toBeInTheDocument();
    expect(screen.getByText('High-performance laptop')).toBeInTheDocument();
    expect(screen.getByText('SN: MBP-001')).toBeInTheDocument();
  });

  it('shows correct status badge for active product', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('displays warranty information', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Warranty: 12 months')).toBeInTheDocument();
  });

  it('displays purchase price when provided', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$2,499.99')).toBeInTheDocument();
  });

  it('shows action buttons when handlers are provided', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleView = vi.fn();
    
    render(
      <ProductCard 
        product={mockProduct} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    );
    
    // Should have 3 buttons (view, edit, delete)
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('calls handlers when buttons are clicked', () => {
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleView = vi.fn();
    
    render(
      <ProductCard 
        product={mockProduct} 
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    
    // Click first button (view)
    fireEvent.click(buttons[0]);
    expect(handleView).toHaveBeenCalledWith(mockProduct);
    
    // Click second button (edit)
    fireEvent.click(buttons[1]);
    expect(handleEdit).toHaveBeenCalledWith(mockProduct);
    
    // Click third button (delete)
    fireEvent.click(buttons[2]);
    expect(handleDelete).toHaveBeenCalledWith(mockProduct);
  });
});
