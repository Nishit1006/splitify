import { cn } from '../../lib/utils';

const colorMap = {
    default: 'bg-gray-100/80 text-gray-600 dark:bg-gray-800/60 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50',
    brand: 'bg-brand-100/80 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/30',
    green: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/30',
    red: 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200/50 dark:border-red-800/30',
    yellow: 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/30',
    blue: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/30',
};

export default function Badge({ children, color = 'default', className }) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold tracking-wide uppercase',
                colorMap[color],
                className
            )}
        >
            {children}
        </span>
    );
}
