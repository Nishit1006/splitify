import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Modal({ open, onClose, title, children, className, size = 'md' }) {
    const handleEsc = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose?.();
        },
        [onClose]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [open, handleEsc]);

    if (!open) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-in fade-in"
                onClick={onClose}
            />

            {/* Content */}
            <div
                className={cn(
                    'relative w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl',
                    'border border-gray-200 dark:border-gray-700',
                    'animate-in zoom-in-95 fade-in duration-200',
                    'max-h-[90vh] flex flex-col',
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>
            </div>
        </div>
    );
}
