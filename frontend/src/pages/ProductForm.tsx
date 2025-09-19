import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import ProductForm from '@/components/products/ProductForm';
import { CreateProductRequest, UpdateProductRequest } from '@/types';
import toast from 'react-hot-toast';

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { 
    currentProduct, 
    loading, 
    fetchProduct, 
    createProduct, 
    updateProduct 
  } = useProducts();

  const isEdit = !!id;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEdit && id) {
      fetchProduct(id);
    }
  }, [isAuthenticated, navigate, isEdit, id, fetchProduct]);

  const handleSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
    try {
      if (isEdit && id) {
        await updateProduct(id, data as UpdateProductRequest);
        toast.success('Product updated successfully');
      } else {
        await createProduct(data as CreateProductRequest);
        toast.success('Product created successfully');
      }
      navigate('/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/3 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
            <div className="space-y-4">
              <div className="h-4 bg-secondary-200 rounded w-full"></div>
              <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
              <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-secondary-600">
          {isEdit 
            ? 'Update your product warranty information.' 
            : 'Add a new product to track its warranty.'
          }
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <ProductForm
          product={currentProduct || undefined}
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default ProductFormPage;
