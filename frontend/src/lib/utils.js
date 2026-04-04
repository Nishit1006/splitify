import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/** Format currency */
export function formatCurrency(amount, currency = '₹') {
    const abs = Math.abs(amount);
    const formatted = abs.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${amount < 0 ? '-' : ''}${currency}${formatted}`;
}

/** Format relative date */
export function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

/** Get user initials for avatar */
export function getInitials(name) {
    if (!name) return '?';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/** Split type display labels */
export const SPLIT_TYPE_LABELS = {
    EQUAL: 'Equal',
    EXACT: 'Exact',
    PERCENTAGE: 'Percentage',
    SHARES: 'Shares',
};

/** Format date with time */
export function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();

    const timeStr = date.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    const dateOpts = {
        day: 'numeric',
        month: 'short',
    };

    if (date.getFullYear() !== now.getFullYear()) {
        dateOpts.year = 'numeric';
    }

    const dateFormatted = date.toLocaleDateString('en-IN', dateOpts);

    return `${dateFormatted}, ${timeStr}`;
}

/** Payment method labels */
export const PAYMENT_METHOD_LABELS = {
    cash: 'Cash',
    upi: 'UPI',
    bank_transfer: 'Bank Transfer',
    card: 'Card',
    other: 'Other',
};
