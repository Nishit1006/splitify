import { cn } from '../../lib/utils';
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
    { label, error, options = [], placeholder, className, ...props },
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
                <select
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-gray-800/60',
                        'text-gray-900 dark:text-gray-100',
                        'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
                        'hover:border-gray-400 dark:hover:border-gray-500',
                        'transition-all duration-200 appearance-none cursor-pointer',
                        'pr-10',
                        error
                            ? 'border-red-400 focus:ring-red-400/30 focus:border-red-400'
                            : 'border-gray-200 dark:border-gray-700',
                        className
                    )}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
});

export default Select;
