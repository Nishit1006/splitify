import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = false, ...props }) {
    return (
        <div
            className={cn(
                'bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800',
                hover && 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer',
                'transition-all duration-200',
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
        <div className={cn('px-6 py-4 border-b border-gray-100 dark:border-gray-800', className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }) {
    return <div className={cn('px-6 py-4', className)}>{children}</div>;
}
