import { InputHTMLAttributes, forwardRef } from 'react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';
import { ErrorMessage } from './ErrorMessage';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      required = false,
      id,
      name,
      className = '',
      ...inputProps
    },
    ref
  ) => {
    const fieldId =
      id || name || `date-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={fieldId}
          name={name}
          type="date"
          hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={className}
          {...inputProps}
        />
        {error && <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

