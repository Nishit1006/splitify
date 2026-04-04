import { cn } from '../../lib/utils';
import { forwardRef } from 'react';

const Input = forwardRef(function Input(
    { label, error, className, type = 'text', icon: Icon, ...props },
    ref
) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={type}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800/60',
                        'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
                        'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
                        'hover:border-gray-400 dark:hover:border-gray-500',
                        'transition-all duration-200',
                        error
                            ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                            : 'border-gray-200 dark:border-gray-700',
                        Icon && 'pl-10',
                        className
                    )}
                    {...props}
                />
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
});

export default Input;
