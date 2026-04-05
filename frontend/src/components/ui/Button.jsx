import { cn } from '../../lib/utils';

const variants = {
    primary:
        'gradient-brand text-white shadow-clayBtn hover:shadow-clayBtnHover hover:-translate-y-1',
    secondary:
        'bg-white text-gray-800 shadow-clayBtn hover:shadow-clayBtnHover dark:bg-gray-800/80 dark:text-gray-200 hover:-translate-y-1',
    outline:
        'border-2 border-brand-300/30 dark:border-brand-600/30 text-gray-700 dark:text-gray-200 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 hover:-translate-y-1',
    danger:
        'bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-clayBtn hover:shadow-clayBtnHover hover:-translate-y-1',
    ghost:
        'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200',
    glow:
        'gradient-brand text-white shadow-clayBtn hover:shadow-clayBtnHover hover:-translate-y-1 animate-pulse-glow',
};

const sizes = {
    sm: 'h-11 px-6 text-sm',
    md: 'h-14 px-8 text-base',
    lg: 'h-16 px-10 text-lg',
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
                'inline-flex items-center justify-center gap-2 font-bold tracking-wide rounded-[20px]',
                'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:shadow-clayBtn',
                'clay-btn-press',
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
