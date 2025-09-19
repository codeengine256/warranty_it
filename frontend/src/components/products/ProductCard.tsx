import React from 'react';
import { Product } from '@/types';
import { formatDate, isProductExpired, isProductExpiringSoon, getStatusBadgeVariant, formatCurrency } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Calendar, DollarSign, Hash, Edit, Trash2, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
}) => {
  const isExpired = isProductExpired(product.endDate);
  const isExpiringSoon = isProductExpiringSoon(product.endDate);
  const statusVariant = getStatusBadgeVariant(product.status);

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (isExpiringSoon) return 'Expiring Soon';
    return product.status;
  };

  const getStatusVariant = () => {
    if (isExpired) return 'error';
    if (isExpiringSoon) return 'warning';
    return statusVariant;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-secondary-600 mb-1">
              {product.brand} • {product.type}
            </p>
            {product.description && (
              <p className="text-sm text-secondary-500 mb-3 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          <Badge variant={getStatusVariant() as any}>
            {getStatusText()}
          </Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-secondary-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Warranty: {product.warrantyPeriod} months</span>
          </div>
          
          <div className="flex items-center text-sm text-secondary-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Started: {formatDate(product.startDate)}</span>
          </div>
          
          <div className="flex items-center text-sm text-secondary-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Expires: {formatDate(product.endDate)}</span>
          </div>

          {product.serialNumber && (
            <div className="flex items-center text-sm text-secondary-600">
              <Hash className="h-4 w-4 mr-2" />
              <span>SN: {product.serialNumber}</span>
            </div>
          )}

          {product.purchasePrice && (
            <div className="flex items-center text-sm text-secondary-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{formatCurrency(product.purchasePrice)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
