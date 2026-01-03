import { SelectHTMLAttributes, forwardRef } from 'react';
import { Label } from '../atoms/Label';
import { ErrorMessage } from './ErrorMessage';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      error,
      required = false,
      options,
      placeholder,
      id,
      name,
      className = '',
      ...selectProps
    },
    ref
  ) => {
    const fieldId =
      id || name || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    const baseStyles =
      'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const errorStyles = error
      ? 'border-destructive focus-visible:ring-destructive'
      : 'border-input';

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <select
          ref={ref}
          id={fieldId}
          name={name}
          className={`${baseStyles} ${errorStyles} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...selectProps}
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
        {error && <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

