import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateProductRequest, UpdateProductRequest, Product } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { calculateEndDate } from '@/lib/utils';

const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters'),
  brand: z
    .string()
    .min(2, 'Brand must be at least 2 characters')
    .max(50, 'Brand must be less than 50 characters'),
  type: z
    .string()
    .min(2, 'Product type must be at least 2 characters')
    .max(50, 'Product type must be less than 50 characters'),
  warrantyPeriod: z
    .number()
    .min(1, 'Warranty period must be at least 1 month')
    .max(120, 'Warranty period must be less than 120 months'),
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((date) => {
      const startDate = new Date(date);
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      return startDate <= now && startDate >= oneYearAgo;
    }, 'Start date must be within the last year and not in the future'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  serialNumber: z
    .string()
    .min(3, 'Serial number must be at least 3 characters')
    .max(50, 'Serial number must be less than 50 characters')
    .optional(),
  purchasePrice: z
    .number()
    .min(0, 'Purchase price must be positive')
    .optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => void;
  loading?: boolean;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  loading = false,
  onCancel,
}) => {
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      brand: product.brand,
      type: product.type,
      warrantyPeriod: product.warrantyPeriod,
      startDate: product.startDate.split('T')[0], // Convert to YYYY-MM-DD format
      description: product.description || '',
      serialNumber: product.serialNumber || '',
      purchasePrice: product.purchasePrice || undefined,
    } : undefined,
  });

  const warrantyPeriod = watch('warrantyPeriod');
  const startDate = watch('startDate');

  // Calculate and display end date
  useEffect(() => {
    if (warrantyPeriod && startDate) {
      const endDate = calculateEndDate(startDate, warrantyPeriod);
      // You could display this in the UI if needed
    }
  }, [warrantyPeriod, startDate]);

  const handleFormSubmit = (data: ProductFormData) => {
    const submitData = {
      ...data,
      purchasePrice: data.purchasePrice || undefined,
    };
    onSubmit(submitData);
  };

  const productTypes = [
    { value: 'Laptop', label: 'Laptop' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Tablet', label: 'Tablet' },
    { value: 'Desktop', label: 'Desktop' },
    { value: 'Headphones', label: 'Headphones' },
    { value: 'Camera', label: 'Camera' },
    { value: 'Gaming Console', label: 'Gaming Console' },
    { value: 'Smart Watch', label: 'Smart Watch' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Product Name"
          name="name"
          placeholder="Enter product name"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Brand"
          name="brand"
          placeholder="Enter brand name"
          required
          error={errors.brand?.message}
          {...register('brand')}
        />

        <Select
          label="Product Type"
          name="type"
          placeholder="Select product type"
          required
          error={errors.type?.message}
          options={productTypes}
          {...register('type')}
        />

        <Input
          label="Warranty Period (months)"
          name="warrantyPeriod"
          type="number"
          placeholder="Enter warranty period"
          required
          min={1}
          max={120}
          error={errors.warrantyPeriod?.message}
          {...register('warrantyPeriod', { valueAsNumber: true })}
        />

        <Input
          label="Start Date"
          name="startDate"
          type="date"
          required
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        <Input
          label="Serial Number"
          name="serialNumber"
          placeholder="Enter serial number (optional)"
          error={errors.serialNumber?.message}
          {...register('serialNumber')}
        />

        <Input
          label="Purchase Price"
          name="purchasePrice"
          type="number"
          placeholder="Enter purchase price (optional)"
          min={0}
          step="0.01"
          error={errors.purchasePrice?.message}
          {...register('purchasePrice', { valueAsNumber: true })}
        />
      </div>

      <Textarea
        label="Description"
        name="description"
        placeholder="Enter product description (optional)"
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      {warrantyPeriod && startDate && (
        <div className="rounded-lg bg-primary-50 p-4">
          <p className="text-sm text-primary-700">
            <span className="font-medium">Warranty End Date:</span>{' '}
            {calculateEndDate(startDate, warrantyPeriod).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
