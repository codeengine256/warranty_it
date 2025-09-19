import React from 'react';
import { FormFieldProps } from '@/types';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends FormFieldProps {
  options: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  name,
  placeholder,
  required = false,
  error,
  className,
  options,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-secondary-700">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      <select
        ref={ref} // Forward the ref
        id={name}
        name={name} // Explicitly set name
        required={required}
        className={cn(
          'block w-full px-3 py-2 border border-secondary-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
          error && 'border-error-300 focus:ring-error-500 focus:border-error-500',
          className
        )}
        {...props} // Spread all other props from register
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
