import { LabelHTMLAttributes, forwardRef } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required = false, className = '', ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
    );
  }
);

Label.displayName = 'Label';

