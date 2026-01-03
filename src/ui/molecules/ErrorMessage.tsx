import { HTMLAttributes } from 'react';

interface ErrorMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  children: string;
}

export function ErrorMessage({ children, className = '', ...props }: ErrorMessageProps) {
  return (
    <p
      className={`text-sm font-bold text-red-700 ${className}`}
      role="alert"
      {...props}
    >
      ⚠️ {children}
    </p>
  );
}

