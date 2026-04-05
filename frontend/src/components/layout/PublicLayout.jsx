import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import gsap from 'gsap';

export default function PublicLayout() {
    const mainRef = useRef(null);

    useEffect(() => {
        if (mainRef.current) {
            gsap.fromTo(
                mainRef.current,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Claymorphism Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full blur-3xl bg-[#6366f1]/15 dark:bg-[#6366f1]/10 animate-clayFloat" />
                <div className="absolute top-[40%] -right-[10%] h-[70vh] w-[70vh] rounded-full blur-3xl bg-[#8B5CF6]/15 dark:bg-[#8B5CF6]/10 animate-clayFloatDelayed" />
                <div className="absolute top-[20%] left-[20%] h-[50vh] w-[50vh] rounded-full blur-3xl bg-[#0EA5E9]/15 dark:bg-[#0EA5E9]/10 animate-clayFloat animation-delay-4000" />
            </div>
            
            <div className="flex flex-col min-h-screen relative z-10">
                <PublicNavbar />
                <main ref={mainRef} className="flex-1">
                    <Outlet />
                </main>
                <PublicFooter />
            </div>
        </div>
    );
}
