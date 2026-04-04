import { useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, User, X, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import gsap from 'gsap';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/groups', icon: Users, label: 'Groups' },
    { to: '/activity', icon: Receipt, label: 'Activity' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
    const navRef = useRef(null);

    useEffect(() => {
        if (navRef.current) {
            gsap.fromTo(
                navRef.current.children,
                { opacity: 0, x: -15 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.35,
                    stagger: 0.06,
                    ease: 'power2.out',
                    delay: 0.1,
                }
            );
        }
    }, []);

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 h-full w-64',
                    'bg-white/80 dark:bg-gray-900/70 glass',
                    'border-r border-gray-200/60 dark:border-gray-800/40',
                    'transform transition-transform duration-300 ease-in-out',
                    'lg:translate-x-0 lg:static lg:z-auto',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100/80 dark:border-gray-800/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Splitify</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-all duration-200"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav ref={navRef} className="p-4 space-y-1.5 lg:mt-20">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/dashboard'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                                    'transition-all duration-200 group',
                                    isActive
                                        ? 'gradient-brand text-white shadow-lg shadow-brand-500/25'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/40 hover:text-gray-900 dark:hover:text-gray-200'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn('w-5 h-5 transition-transform duration-200', !isActive && 'group-hover:scale-110')} />
                                    {item.label}
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom branding */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="px-4 py-3.5 rounded-2xl bg-gradient-to-br from-brand-50/80 to-violet-50/80 dark:from-brand-950/30 dark:to-violet-950/30 border border-brand-100/60 dark:border-brand-800/20">
                        <p className="text-xs font-bold text-brand-700 dark:text-brand-300 tracking-wide">Splitify v2.0</p>
                        <p className="text-[10px] text-brand-500/80 dark:text-brand-400/60 mt-0.5">Split smart, settle fast ✨</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
