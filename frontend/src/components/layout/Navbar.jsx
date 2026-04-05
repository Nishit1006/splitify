import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, Menu, LogOut, User, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from '../ui/Avatar';
import api from '../../lib/api';
import gsap from 'gsap';

export default function Navbar({ onMenuClick }) {
    const { user, logout } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const themeRef = useRef(null);

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

    const handleThemeToggle = () => {
        if (themeRef.current) {
            gsap.to(themeRef.current, {
                rotation: 360,
                duration: 0.5,
                ease: 'back.out(1.7)',
                onComplete: () => gsap.set(themeRef.current, { rotation: 0 }),
            });
        }
        toggleTheme();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-4 z-30 mx-4 lg:mx-8 h-16 rounded-[32px] bg-clay-card/90 backdrop-blur-xl shadow-clayCard border-0 transition-all duration-300">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-all duration-200"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link to="/dashboard" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow duration-300">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block tracking-tight">
                            Splitify
                        </span>
                    </Link>
                </div>

                {/* Right */}
                <div className="flex items-center gap-1.5">
                    {/* Dark mode toggle */}
                    <button
                        ref={themeRef}
                        onClick={handleThemeToggle}
                        className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-gray-800/60 transition-all duration-200"
                        title={dark ? 'Light mode' : 'Dark mode'}
                    >
                        {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Notifications */}
                    <Link
                        to="/notifications"
                        className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-gray-800/60 transition-all duration-200"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-5 h-5 gradient-brand rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm animate-pulse-glow">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Link>

                    {/* User dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800/60 transition-all duration-200"
                        >
                            <Avatar name={user?.fullName} size="sm" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block max-w-30 truncate">
                                {user?.fullName}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-60 bg-clay-card backdrop-blur-xl rounded-[20px] shadow-clayCard border-t border-white/40 dark:border-white/5 py-1.5 z-50 animate-scale-in">
                                <div className="px-4 py-3 border-b border-gray-200/20 dark:border-gray-700/20">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        {user?.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                        @{user?.username}
                                    </p>
                                </div>
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition-colors rounded-xl mx-1"
                                >
                                    <User className="w-4 h-4" />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors rounded-xl mx-1"
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
