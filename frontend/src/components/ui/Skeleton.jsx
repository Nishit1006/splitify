import { cn } from '../../lib/utils';

export default function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                'rounded-[20px] bg-clay-input relative overflow-hidden shadow-clayPressed',
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent" />
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-[28px] bg-clay-card shadow-clayCard border-t border-white/40 dark:border-white/5 p-6 space-y-4">
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
