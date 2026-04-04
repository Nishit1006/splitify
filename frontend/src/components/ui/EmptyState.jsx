import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function EmptyState({
    icon: Icon = Inbox,
    title = 'Nothing here yet',
    description,
    action,
    className,
}) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/80 dark:to-gray-800/40 flex items-center justify-center mb-5 shadow-sm border border-gray-100 dark:border-gray-700/50">
                <Icon className="w-9 h-9 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1.5">{title}</h3>
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-5">{description}</p>
            )}
            {action}
        </div>
    );
}
