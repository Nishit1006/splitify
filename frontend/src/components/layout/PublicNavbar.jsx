import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../ui/Button';
import gsap from 'gsap';

export default function PublicNavbar() {
    const { dark, toggleTheme } = useTheme();
    const themeRef = useRef(null);

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

    return (
        <header className="sticky top-4 z-50 mx-4 lg:mx-8 h-16 sm:h-20 rounded-[32px] sm:rounded-[40px] bg-clay-card/90 backdrop-blur-xl shadow-clayCard border-b border-white/40 dark:border-white/5 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-4 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 gradient-brand rounded-[16px] flex items-center justify-center shadow-clayBtn group-hover:scale-105 transition-transform duration-300">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black font-heading text-gray-900 dark:text-white tracking-tight">
                        Splitify
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/about" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About Us</Link>
                    <Link to="/faq" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">FAQs</Link>
                    <Link to="/contact" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        ref={themeRef}
                        onClick={handleThemeToggle}
                        className="p-2.5 rounded-[20px] text-gray-500 shadow-sm border border-transparent hover:shadow-clayPressed hover:border-brand-200/50 dark:hover:border-brand-800/50 dark:text-gray-400 bg-[#EFEBF5]/50 dark:bg-[#1e1b4b]/50 transition-all duration-200"
                        title={dark ? 'Light mode' : 'Dark mode'}
                    >
                        {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                    </button>
                    
                    <div className="hidden sm:flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost">Log In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="glow">Sign Up</Button>
                        </Link>
                    </div>

                    <button className="md:hidden p-2 rounded-[20px] bg-[#EFEBF5]/50 dark:bg-[#1e1b4b]/50 text-gray-500 shadow-sm transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
