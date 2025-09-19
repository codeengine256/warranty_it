import React from 'react';
import { FormFieldProps } from '@/types';
import { cn } from '@/lib/utils';

interface TextareaProps extends FormFieldProps {
  rows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  name,
  placeholder,
  required = false,
  error,
  className,
  rows = 3,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-secondary-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      <textarea
        ref={ref} // Forward the ref
        id={name}
        name={name} // Explicitly set name
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={cn(
          'block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm resize-vertical',
          error && 'border-error-300 focus:ring-error-500 focus:border-error-500',
          className
        )}
        {...props} // Spread all other props from register
      />
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
