import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import gsap from 'gsap';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const mainRef = useRef(null);

    useEffect(() => {
        if (mainRef.current) {
            gsap.fromTo(
                mainRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, []);

    return (
        <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1120] relative">
            {/* Gradient mesh background */}
            <div className="fixed inset-0 gradient-mesh dark:gradient-mesh-dark pointer-events-none z-0" />

            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <main ref={mainRef} className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
