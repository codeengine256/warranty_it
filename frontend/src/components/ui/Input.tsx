import React from 'react';
import { FormFieldProps } from '@/types';
import { cn } from '@/lib/utils';

interface InputProps extends FormFieldProps {
  min?: string | number;
  max?: string | number;
  step?: string | number;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  className,
  min,
  max,
  step,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-secondary-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className={cn(
          'block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
          error && 'border-error-300 focus:ring-error-500 focus:border-error-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
