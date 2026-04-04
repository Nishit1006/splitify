import { cn } from '../../lib/utils';

const variants = {
    primary:
        'gradient-brand text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
        'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/80 hover:scale-[1.02] active:scale-[0.98]',
    outline:
        'border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-brand-300 dark:hover:border-brand-600',
    danger:
        'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-[1.02] active:scale-[0.98]',
    ghost:
        'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200',
    glow:
        'gradient-brand text-white animate-pulse-glow hover:scale-[1.02] active:scale-[0.98]',
};

const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading,
    ...props
}) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
                'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                'transition-all duration-200',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
        </button>
    );
}
