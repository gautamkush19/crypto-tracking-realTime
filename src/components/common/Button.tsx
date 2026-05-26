import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'icon';
  icon?: ReactNode;
  isLoading?: boolean;
};

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="icon-spin" size={16} aria-hidden="true" /> : icon}
      {children ? <span>{children}</span> : null}
    </button>
  );
}
