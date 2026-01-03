import { HTMLAttributes } from 'react';

interface SuccessMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  children: string;
}

export function SuccessMessage({
  children,
  className = '',
  ...props
}: SuccessMessageProps) {
  return (
    <p
      className={`rounded-lg border-2 border-green-300 bg-green-50 p-4 text-sm font-bold text-green-700 ${className}`}
      role="alert"
      {...props}
    >
      ✅ {children}
    </p>
  );
}

