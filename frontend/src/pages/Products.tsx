import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { Product } from '@/types';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { products, loading, pagination, fetchProducts, deleteProduct } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchProducts({ page: currentPage, limit: 12 });
  }, [isAuthenticated, navigate, fetchProducts, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    fetchProducts({ 
      page: 1, 
      limit: 12,
      // Add search parameters when backend supports it
    });
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    // Implement status filtering
    fetchProducts({ 
      page: 1, 
      limit: 12,
      // Add status filter when backend supports it
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts({ page, limit: 12 });
  };

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      fetchProducts({ page: currentPage, limit: 12 });
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setProductToDelete(null);
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'CLAIMED', label: 'Claimed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-secondary-200 rounded w-full"></div>
                  <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Products</h1>
          <p className="text-secondary-600">Manage your product warranties</p>
        </div>
        <Button onClick={handleAddProduct} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                name="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          
          <Select
            name="status"
            placeholder="Filter by status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="sm:w-48"
          />
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-secondary-400 hover:text-secondary-600'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-secondary-400 hover:text-secondary-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-secondary-400" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">No products found</h3>
          <p className="text-secondary-600 mb-6">
            {searchTerm || statusFilter 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first product warranty.'
            }
          </p>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <>
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-secondary-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-secondary-300 text-sm font-medium rounded-md text-secondary-700 bg-white hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-secondary-700">
                    Showing{' '}
                    <span className="font-medium">
                      {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-secondary-300 bg-white text-sm font-medium text-secondary-500 hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone and will permanently remove the product from your warranty list.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
};

export default Products;
