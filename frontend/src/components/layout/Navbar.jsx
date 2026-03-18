import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../ui/Avatar';
import api from '../../lib/api';

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const { data } = await api.get('/notifications/unread-count');
                setUnreadCount(data.data?.count || 0);
            } catch {
                // ignore
            }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 glass border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
                            Splitify
                        </span>
                    </Link>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {/* Dark mode toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                        title={dark ? 'Light mode' : 'Dark mode'}
                    >
                        {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Notifications */}
                    <Link
                        to="/notifications"
                        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 gradient-brand rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Link>

                    {/* User dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <Avatar name={user?.fullName} size="sm" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-30 truncate">
                                {user?.fullName}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user?.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        @{user?.username}
                                    </p>
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
