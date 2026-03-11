import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Receipt, Wallet, User, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/groups', icon: Users, label: 'Groups' },
    { to: '/activity', icon: Receipt, label: 'Activity' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ open, onClose }) {
    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-900',
                    'border-r border-gray-200 dark:border-gray-800',
                    'transform transition-transform duration-300 ease-in-out',
                    'lg:translate-x-0 lg:static lg:z-auto',
                    open ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">Splitify</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 lg:mt-20">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                                    'transition-all duration-200',
                                    isActive
                                        ? 'gradient-brand text-white shadow-md shadow-brand-500/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom branding */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/50 dark:to-indigo-950/50 border border-brand-100 dark:border-brand-800/30">
                        <p className="text-xs font-medium text-brand-700 dark:text-brand-300">Splitify v1.0</p>
                        <p className="text-[10px] text-brand-500 dark:text-brand-400 mt-0.5">Split smart, settle fast</p>
                    </div>
                </div>
            </aside>
        </>
    );
}
