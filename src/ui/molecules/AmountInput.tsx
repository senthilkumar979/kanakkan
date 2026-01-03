import { InputHTMLAttributes, forwardRef } from 'react';
import { Label } from '../atoms/Label';
import { Input } from '../atoms/Input';
import { ErrorMessage } from './ErrorMessage';
import { CURRENCY_SYMBOL } from '@/utils/currency';

interface AmountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const AmountInput = forwardRef<HTMLInputElement, AmountInputProps>(
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
      id || name || `amount-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {CURRENCY_SYMBOL}
          </span>
          <Input
            ref={ref}
            id={fieldId}
            name={name}
            type="number"
            step="0.01"
            min="0.01"
            hasError={!!error}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={`pl-8 ${className}`}
            placeholder="0.00"
            {...inputProps}
          />
        </div>
        {error && <ErrorMessage id={`${fieldId}-error`}>{error}</ErrorMessage>}
      </div>
    );
  }
);

AmountInput.displayName = 'AmountInput';

