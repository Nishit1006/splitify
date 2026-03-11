import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(function Input(
    { label, error, className, type = 'text', ...props },
    ref
) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                className={cn(
                    'w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800',
                    'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500',
                    'transition-all duration-200',
                    error
                        ? 'border-red-400 focus:ring-red-400/40 focus:border-red-400'
                        : 'border-gray-300 dark:border-gray-600',
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
});

export default Input;
