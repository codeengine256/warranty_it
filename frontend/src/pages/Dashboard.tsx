import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProducts } from '@/hooks/useProducts';
import ProductStats from '@/components/products/ProductStats';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import { formatDate, isProductExpired, isProductExpiringSoon } from '@/lib/utils';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { products, stats, loading, fetchProducts, fetchProductStats, deleteProduct } = useProducts();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch initial data
    fetchProducts({ limit: 12 });
    fetchProductStats();
  }, [isAuthenticated, navigate, fetchProducts, fetchProductStats]);

  // Get recent products and expiring products
  const recentProducts = products.slice(0, 6);
  const expiringProducts = products.filter(product => 
    isProductExpiringSoon(product.endDate) && !isProductExpired(product.endDate)
  );

  const handleAddProduct = () => {
    navigate('/products/new');
  };

  const handleViewProduct = (product: any) => {
    navigate(`/products/${product.id}`);
  };

  const handleEditProduct = (product: any) => {
    navigate(`/products/${product.id}/edit`);
  };

  const handleDeleteProduct = (product: any) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      fetchProducts({ limit: 6 });
      fetchProductStats();
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200">
                <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-secondary-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-secondary-600">
          Here's an overview of your product warranties and recent activity.
        </p>
      </div>

      {/* Stats */}
      <ProductStats stats={stats} loading={loading} />

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-secondary-900">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
          <Button variant="outline" onClick={() => navigate('/products')}>
            <Package className="h-4 w-4 mr-2" />
            View All Products
          </Button>
        </div>
      </div>

      {/* Expiring Products Alert */}
      {expiringProducts.length > 0 && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-warning-600 mr-2" />
            <h3 className="text-lg font-semibold text-warning-800">
              Products Expiring Soon
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expiringProducts.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-4 border border-warning-200">
                <h4 className="font-medium text-secondary-900">{product.name}</h4>
                <p className="text-sm text-secondary-600">{product.brand}</p>
                <p className="text-sm text-warning-600 mt-1">
                  Expires: {formatDate(product.endDate)}
                </p>
              </div>
            ))}
          </div>
          {expiringProducts.length > 3 && (
            <p className="text-sm text-warning-700 mt-2">
              And {expiringProducts.length - 3} more products expiring soon...
            </p>
          )}
        </div>
      )}

      {/* Recent Products */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-secondary-900">Recent Products</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
            View All
          </Button>
        </div>
        
        {recentProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No products yet</h3>
            <p className="text-secondary-600 mb-4">
              Get started by adding your first product warranty.
            </p>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleViewProduct}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        )}
      </div>

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

export default Dashboard;
