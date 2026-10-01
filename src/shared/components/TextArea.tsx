import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, hint, maxLength, showCount = false, className, id, value, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const charCount = typeof value === 'string' ? value.length : 0;
    
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            maxLength={maxLength}
            className={cn(
              'w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
              'transition-all duration-200 resize-none',
              error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200',
              className
            )}
            {...props}
          />
          {showCount && maxLength && (
            <span className={cn(
              'absolute bottom-2 right-3 text-xs',
              charCount >= maxLength ? 'text-red-500' : 'text-gray-400'
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hint && !error && <p className="text-sm text-gray-500">{hint}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
