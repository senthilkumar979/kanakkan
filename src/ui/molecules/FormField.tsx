import { InputHTMLAttributes, forwardRef } from 'react';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { ErrorMessage } from './ErrorMessage';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      required = false,
      id,
      name,
      ...inputProps
    },
    ref
  ) => {
    const fieldId = id || name || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <Input
          ref={ref}
          id={fieldId}
          name={name}
          hasError={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...inputProps}
        />
        {error && <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

