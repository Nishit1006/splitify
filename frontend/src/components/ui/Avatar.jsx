import { cn, getInitials } from '../../lib/utils';

const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
};

const colorPalette = [
    'bg-brand-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-violet-500',
    'bg-pink-500',
    'bg-teal-500',
];

function getColorFromName(name) {
    if (!name) return colorPalette[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorPalette[Math.abs(hash) % colorPalette.length];
}

export default function Avatar({ name, src, size = 'md', className }) {
    const initials = getInitials(name);
    const bgColor = getColorFromName(name);

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={cn('rounded-full object-cover ring-2 ring-white dark:ring-gray-800', sizeMap[size], className)}
            />
        );
    }

    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center text-white font-semibold ring-2 ring-white dark:ring-gray-800',
                sizeMap[size],
                bgColor,
                className
            )}
            title={name}
        >
            {initials}
        </div>
    );
}
