import { ReactNode } from 'react';
import { XCircle } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}

export function Alert({ children, variant = 'default', className = '' }: AlertProps) {
  const baseClass = 'relative w-full rounded-lg border p-4 mb-4';
  const variantClass = variant === 'destructive' 
    ? 'border-red-200 bg-red-50 text-red-800' 
    : 'border-gray-200 bg-gray-50 text-gray-800';
  
  return (
    <div className={`${baseClass} ${variantClass} ${className}`} role="alert">
      {children}
    </div>
  );
}

export function AlertTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
} 