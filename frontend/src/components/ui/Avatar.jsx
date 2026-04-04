import { cn, getInitials } from '../../lib/utils';

const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
};

const gradientPalette = [
    'from-brand-500 to-violet-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-emerald-500',
];

function getGradientFromName(name) {
    if (!name) return gradientPalette[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradientPalette[Math.abs(hash) % gradientPalette.length];
}

export default function Avatar({ name, src, size = 'md', className }) {
    const initials = getInitials(name);
    const gradient = getGradientFromName(name);

    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className={cn(
                    'rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm',
                    sizeMap[size],
                    className
                )}
            />
        );
    }

    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center text-white font-bold',
                'bg-gradient-to-br shadow-sm ring-2 ring-white dark:ring-gray-800',
                sizeMap[size],
                gradient,
                className
            )}
            title={name}
        >
            {initials}
        </div>
    );
}
