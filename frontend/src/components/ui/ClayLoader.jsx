import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';

export default function ClayLoader({ text = 'Loading...', fullScreen = false }) {
    const containerRef = useRef(null);
    const dotsRef = useRef(null);
    const orbRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Orb breathing animation
            if (orbRef.current) {
                gsap.to(orbRef.current, {
                    scale: 1.08,
                    duration: 1.5,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inOut',
                });
                gsap.to(orbRef.current, {
                    rotation: 360,
                    duration: 8,
                    repeat: -1,
                    ease: 'none',
                });
            }

            // Fade in entire loader
            if (containerRef.current) {
                gsap.fromTo(containerRef.current,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
                );
            }
        });
        return () => ctx.revert();
    }, []);

    const content = (
        <div ref={containerRef} className="flex flex-col items-center justify-center gap-6">
            {/* Glowing Orb */}
            <div className="relative">
                <div ref={orbRef} className="w-20 h-20 rounded-full gradient-brand shadow-clayBtn flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                {/* Glow ring */}
                <div className="absolute inset-[-8px] rounded-full border-2 border-brand-300/30 dark:border-brand-500/20 animate-pulse-glow" />
            </div>

            {/* Bouncing dots */}
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-400 dark:bg-brand-500 clay-loader-dot shadow-clayBtn" />
                <div className="w-3 h-3 rounded-full bg-brand-500 dark:bg-brand-400 clay-loader-dot shadow-clayBtn" />
                <div className="w-3 h-3 rounded-full bg-brand-600 dark:bg-brand-300 clay-loader-dot shadow-clayBtn" />
            </div>

            {/* Loading text */}
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                {text}
            </p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-clay-bg">
                {/* Background blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-[10%] -left-[10%] h-[60vh] w-[60vh] rounded-full blur-3xl bg-brand-500/15 dark:bg-brand-500/10 animate-clayFloat" />
                    <div className="absolute top-[40%] -right-[10%] h-[70vh] w-[70vh] rounded-full blur-3xl bg-violet-500/15 dark:bg-violet-500/10 animate-clayFloatDelayed" />
                </div>
                <div className="relative z-10">{content}</div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-20">
            {content}
        </div>
    );
}
