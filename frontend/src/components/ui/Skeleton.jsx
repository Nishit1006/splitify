import { cn } from '../../lib/utils';

export default function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800',
                className
            )}
            {...props}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 p-6 space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-4 w-1/3" />
        </div>
    );
}
