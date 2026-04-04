import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Modal({ open, onClose, title, children, className, size = 'md' }) {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

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
                ref={overlayRef}
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Content */}
            <div
                ref={contentRef}
                className={cn(
                    'relative w-full bg-white dark:bg-gray-900/95 rounded-2xl',
                    'shadow-2xl dark:shadow-brand-950/50',
                    'border border-gray-200/80 dark:border-gray-700/50',
                    'animate-scale-in',
                    'max-h-[90vh] flex flex-col',
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800/60">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800/80 transition-all duration-200"
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
