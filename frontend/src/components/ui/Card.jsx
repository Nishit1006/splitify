import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = false, glass = false, ...props }) {
    return (
        <div
            className={cn(
                'rounded-2xl border transition-all duration-300',
                glass
                    ? 'glass-card border-white/20 dark:border-gray-700/50'
                    : 'bg-white dark:bg-gray-900/80 border-gray-100 dark:border-gray-800/60 shadow-card',
                hover && 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }) {
    return (
        <div className={cn('px-6 py-4 border-b border-gray-100/80 dark:border-gray-800/60', className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }) {
    return <div className={cn('px-6 py-4', className)}>{children}</div>;
}
