import React from 'react';

interface AlertProps {
  type: 'info' | 'warning' | 'error' | 'success';
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function Alert({ type, children, onClose, className = '' }: AlertProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
    success: 'bg-green-pale border-green-200 text-green-deep',
  };

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${styles[type]} ${className}`}>
      <div className="flex-1 text-sm">{children}</div>
      {onClose && (
        <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
