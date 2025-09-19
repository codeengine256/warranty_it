import React, { useEffect } from 'react';
import { ModalProps } from '@/types';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div
          className={cn(
            'relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-secondary-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
