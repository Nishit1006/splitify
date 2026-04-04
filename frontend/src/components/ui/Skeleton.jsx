import { cn } from '../../lib/utils';

export default function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'rounded-xl bg-gray-200/80 dark:bg-gray-800/60 relative overflow-hidden',
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-gray-900/80 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800/60 p-6 space-y-4">
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
