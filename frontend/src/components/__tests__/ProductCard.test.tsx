import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../products/ProductCard';
import { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'MacBook Pro',
  brand: 'Apple',
  type: 'Laptop',
  warrantyPeriod: 12,
  startDate: '2023-01-01T00:00:00Z',
  endDate: '2024-01-01T00:00:00Z',
  description: 'High-performance laptop',
  serialNumber: 'MBP-001',
  purchasePrice: 2499.99,
  status: 'ACTIVE',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
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

  it('handles edit action', () => {
    const handleEdit = jest.fn();
    render(<ProductCard product={mockProduct} onEdit={handleEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    expect(handleEdit).toHaveBeenCalledWith(mockProduct);
  });

  it('handles delete action', () => {
    const handleDelete = jest.fn();
    render(<ProductCard product={mockProduct} onDelete={handleDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(handleDelete).toHaveBeenCalledWith(mockProduct);
  });

  it('handles view action', () => {
    const handleView = jest.fn();
    render(<ProductCard product={mockProduct} onView={handleView} />);
    
    const viewButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewButton);
    expect(handleView).toHaveBeenCalledWith(mockProduct);
  });

  it('shows correct status badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('displays warranty information', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Warranty: 12 months')).toBeInTheDocument();
  });
});
