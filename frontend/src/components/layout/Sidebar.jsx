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

            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 h-full w-64',
                    'bg-clay-card backdrop-blur-xl',
                    'border-r border-gray-200/40 dark:border-gray-800/20 shadow-clayCard',
                    'transform transition-transform duration-300 ease-in-out',
                    'lg:translate-x-0 lg:static lg:z-auto lg:rounded-r-[48px]',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100/80 dark:border-gray-800/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 gradient-brand rounded-[16px] flex items-center justify-center shadow-clayBtn">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-black font-heading text-gray-900 dark:text-white tracking-tight">Splitify</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-[20px] bg-[#EFEBF5]/50 dark:bg-[#1e1b4b]/50 text-gray-500 shadow-sm transition-all duration-200 clay-btn-press"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav ref={navRef} className="p-4 space-y-2 lg:mt-20">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/dashboard'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-[20px] text-sm font-bold',
                                    'transition-all duration-300 group clay-btn-press hover:-translate-y-1',
                                    isActive
                                        ? 'gradient-brand text-white shadow-clayBtn'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-[#EFEBF5]/80 dark:hover:bg-[#1e1b4b]/80 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm'
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
                <div className="absolute bottom-6 left-4 right-4">
                    <div className="px-4 py-4 rounded-[24px] bg-gradient-to-br from-brand-50/80 to-violet-50/80 dark:from-brand-950/30 dark:to-violet-950/30 shadow-clayPressed border-0">
                        <p className="text-xs font-black font-heading text-brand-700 dark:text-brand-300 tracking-wide uppercase">Splitify v2.0</p>
                        <p className="text-[10px] font-bold text-brand-500/80 dark:text-brand-400/60 mt-0.5">Split smart, settle fast ✨</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
