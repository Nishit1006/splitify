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
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] relative">
            <div className="fixed inset-0 gradient-mesh dark:gradient-mesh-dark pointer-events-none z-0" />
            
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
