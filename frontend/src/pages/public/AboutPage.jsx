import { useEffect, useRef } from 'react';
import { Target, Star, Globe } from 'lucide-react';
import gsap from 'gsap';

export default function AboutPage() {
    const headerRef = useRef(null);

    useEffect(() => {
        if (headerRef.current) {
            gsap.fromTo(headerRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, []);

    const values = [
        { icon: Target, title: 'Accuracy First', desc: 'No more confusing math. We guarantee transparent and accurate percentage calculations.' },
        { icon: Star, title: 'Premium Experience', desc: 'Financial tools shouldn\'t be boring. We built this to look and feel amazing.' },
        { icon: Globe, title: 'Accessible Always', desc: 'Access your balances anytime, anywhere, on any device.' }
    ];

    return (
        <div className="w-full pb-24">
            {/* Header Content */}
            <div className="relative overflow-hidden bg-white/50 dark:bg-gray-900/40 border-b border-gray-200/60 dark:border-gray-800/40 pt-20 pb-20">
                <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark pointer-events-none opacity-60" />
                <div ref={headerRef} className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm mb-4">Our Mission</h1>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Making Shared Finances Seamless</h2>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
                        Splitify was created to remove the awkwardness of asking friends for money. 
                        We believe that keeping track of shared expenses should be as beautiful as the memories you're making together.
                    </p>
                </div>
            </div>

            {/* Values Section */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value, i) => (
                        <div key={i} className="p-8 rounded-2xl glass-card border border-gray-200/60 dark:border-gray-700/40 hover:shadow-glow-sm transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center text-white mb-6 shadow-lg shadow-brand-500/20">
                                <value.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                {value.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Story */}
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">The Story</h3>
                <div className="space-y-6 text-gray-500 dark:text-gray-400 leading-relaxed">
                    <p>
                        It started with a group trip where tracking receipts became a nightmare of confusing spreadsheets and missing venmo requests. 
                        We realized there had to be a better way to split expenses that didn't feel like doing taxes.
                    </p>
                    <p>
                        We built Splitify to be the ultimate companion for roommates, travelers, and friends. By providing a beautiful, robust platform, 
                        we ensure you can focus on enjoying your time together, while we handle the math in the background.
                    </p>
                </div>
            </div>
        </div>
    );
}
