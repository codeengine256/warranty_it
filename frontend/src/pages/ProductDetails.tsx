import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Package, 
  Hash,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { formatDate, isProductExpired, isProductExpiringSoon, calculateDaysRemaining, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProduct, loading, error, fetchProduct, deleteProduct } = useProducts();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id, fetchProduct]);

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentProduct) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(currentProduct.id);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const handleBack = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-secondary-200 rounded w-3/4"></div>
              <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
              <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
        
        <div className="bg-error-50 border border-error-200 rounded-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-error-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-error-800 mb-2">
            Product Not Found
          </h3>
          <p className="text-error-600 mb-4">
            The product you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={handleBack}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = isProductExpired(currentProduct.endDate);
  const isExpiringSoon = isProductExpiringSoon(currentProduct.endDate);
  const daysRemaining = calculateDaysRemaining(currentProduct.endDate);

  const getStatusBadge = () => {
    if (isExpired) {
      return <Badge variant="error">Expired</Badge>;
    }
    if (isExpiringSoon) {
      return <Badge variant="warning">Expiring Soon</Badge>;
    }
    return <Badge variant="success">Active</Badge>;
  };

  const getStatusIcon = () => {
    if (isExpired) {
      return <XCircle className="h-5 w-5 text-error-500" />;
    }
    if (isExpiringSoon) {
      return <AlertTriangle className="h-5 w-5 text-warning-500" />;
    }
    return <CheckCircle className="h-5 w-5 text-success-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          {getStatusBadge()}
        </div>
      </div>

      {/* Product Details Card */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden">
        {/* Product Header */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                {currentProduct.name}
              </h1>
              <p className="text-xl text-secondary-600 mb-4">
                {currentProduct.brand} • {currentProduct.type}
              </p>
              <div className="flex items-center space-x-4 text-sm text-secondary-500">
                <span className="flex items-center">
                  <Package className="h-4 w-4 mr-1" />
                  Added {formatDate(currentProduct.createdAt)}
                </span>
                {currentProduct.serialNumber && (
                  <span className="flex items-center">
                    <Hash className="h-4 w-4 mr-1" />
                    {currentProduct.serialNumber}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteClick}
                className="flex items-center text-white bg-error-600 hover:bg-error-700 border-error-600 hover:border-error-700 focus:ring-error-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Warranty Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Warranty Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-secondary-100">
                  <span className="text-secondary-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Start Date
                  </span>
                  <span className="font-medium">{formatDate(currentProduct.startDate)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-secondary-100">
                  <span className="text-secondary-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    End Date
                  </span>
                  <span className="font-medium">{formatDate(currentProduct.endDate)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-secondary-100">
                  <span className="text-secondary-600 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Warranty Period
                  </span>
                  <span className="font-medium">{currentProduct.warrantyPeriod} months</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-secondary-600 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Days Remaining
                  </span>
                  <span className={`font-medium ${isExpired ? 'text-error-600' : isExpiringSoon ? 'text-warning-600' : 'text-success-600'}`}>
                    {isExpired ? 'Expired' : `${daysRemaining} days`}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Additional Information
              </h3>
              
              <div className="space-y-3">
                {currentProduct.purchasePrice && (
                  <div className="flex items-center justify-between py-2 border-b border-secondary-100">
                    <span className="text-secondary-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Purchase Price
                    </span>
                    <span className="font-medium">
                      {formatCurrency(currentProduct.purchasePrice)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-2 border-b border-secondary-100">
                  <span className="text-secondary-600">Status</span>
                  <span className="font-medium">{currentProduct.status}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-secondary-100">
                  <span className="text-secondary-600">Created</span>
                  <span className="font-medium">{formatDate(currentProduct.createdAt)}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-secondary-600">Last Updated</span>
                  <span className="font-medium">{formatDate(currentProduct.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {currentProduct.description && (
            <div className="mt-6 pt-6 border-t border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                Description
              </h3>
              <p className="text-secondary-700 leading-relaxed">
                {currentProduct.description}
              </p>
            </div>
          )}

          {/* Warranty Progress Bar */}
          <div className="mt-6 pt-6 border-t border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900 mb-3">
              Warranty Progress
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-secondary-600">
                <span>Warranty Period</span>
                <span>{currentProduct.warrantyPeriod} months</span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isExpired 
                      ? 'bg-error-500' 
                      : isExpiringSoon 
                        ? 'bg-warning-500' 
                        : 'bg-success-500'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, (daysRemaining / (currentProduct.warrantyPeriod * 30)) * 100))}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-secondary-500">
                <span>{formatDate(currentProduct.startDate)}</span>
                <span>{formatDate(currentProduct.endDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${currentProduct?.name}"? This action cannot be undone and will permanently remove the product from your warranty list.`}
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
};

export default ProductDetails;
