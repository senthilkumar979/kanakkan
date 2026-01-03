import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = '', ...props }, ref) => {
    const baseStyles =
      'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const errorStyles = hasError
      ? 'border-destructive focus-visible:ring-destructive'
      : 'border-input';

    return (
      <input
        ref={ref}
        className={`${baseStyles} ${errorStyles} ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

