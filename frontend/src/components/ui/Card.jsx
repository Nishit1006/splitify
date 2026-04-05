import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = false, glass = false, ...props }) {
    return (
        <div
            className={cn(
                'rounded-[28px] transition-all duration-300 border-t border-white/40 dark:border-white/5',
                glass
                    ? 'glass-card backdrop-blur-xl'
                    : 'bg-clay-card backdrop-blur-xl shadow-clayCard',
                hover && 'hover:-translate-y-1 cursor-pointer',
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
        <div className={cn('px-6 py-4 border-b border-gray-200/20 dark:border-gray-700/20', className)}>
            {children}
        </div>
    );
}

export function CardContent({ children, className }) {
    return <div className={cn('px-6 py-4', className)}>{children}</div>;
}
