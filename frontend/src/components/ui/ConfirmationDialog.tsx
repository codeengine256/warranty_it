import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: XCircle,
          iconColor: 'text-error-500',
          iconBg: 'bg-error-50',
          confirmButton: 'bg-error-600 hover:bg-error-700 focus:ring-error-500',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-warning-500',
          iconBg: 'bg-warning-50',
          confirmButton: 'bg-warning-600 hover:bg-warning-700 focus:ring-warning-500',
        };
      case 'info':
        return {
          icon: Info,
          iconColor: 'text-info-500',
          iconBg: 'bg-info-50',
          confirmButton: 'bg-info-600 hover:bg-info-700 focus:ring-info-500',
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: 'text-success-500',
          iconBg: 'bg-success-50',
          confirmButton: 'bg-success-600 hover:bg-success-700 focus:ring-success-500',
        };
      default:
        return {
          icon: AlertTriangle,
          iconColor: 'text-error-500',
          iconBg: 'bg-error-50',
          confirmButton: 'bg-error-600 hover:bg-error-700 focus:ring-error-500',
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
    >
      <div className="text-center">
        {/* Icon */}
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg} mb-4`}>
          <IconComponent className={`h-6 w-6 ${styles.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-secondary-600 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="mt-3 sm:mt-0"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
            className={`text-white ${styles.confirmButton} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
