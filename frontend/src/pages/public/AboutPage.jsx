import { useEffect, useRef } from 'react';
import { Target, Star, Globe, Heart, Sparkles, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const values = [
    { icon: Target, title: 'Accuracy First', desc: 'No more confusing math. We guarantee transparent and accurate percentage calculations for every single expense.' },
    { icon: Star, title: 'Premium Experience', desc: 'Financial tools shouldn\'t be boring. We built Splitify to look and feel amazing — because you deserve beautiful software.' },
    { icon: Globe, title: 'Accessible Always', desc: 'Access your balances anytime, anywhere, on any device. Splitify works flawlessly on desktop, tablet, and mobile.' }
];

const team = [
    { name: 'The Vision', emoji: '🚀', desc: 'We saw friends struggling with spreadsheets after every trip. There had to be a better way — so we built one.' },
    { name: 'The Build', emoji: '🔨', desc: 'Months of iteration, user testing, and design refinement went into creating the most intuitive expense-splitting experience.' },
    { name: 'The Future', emoji: '✨', desc: 'We\'re constantly improving Splitify with new features like multi-currency support, payment integrations, and AI-powered insights.' }
];

export default function AboutPage() {
    const headerRef = useRef(null);
    const valuesRef = useRef(null);
    const storyRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.fromTo(headerRef.current.children,
                    { opacity: 0, y: 25 },
                    { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
                );
            }
            if (valuesRef.current) {
                gsap.fromTo('.value-card',
                    { opacity: 0, y: 30, scale: 0.95 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.4)',
                      scrollTrigger: { trigger: valuesRef.current, start: 'top 80%', once: true } }
                );
            }
            if (storyRef.current) {
                gsap.fromTo('.story-card',
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.5, stagger: 0.15, ease: 'power2.out',
                      scrollTrigger: { trigger: storyRef.current, start: 'top 80%', once: true } }
                );
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full pb-24">
            {/* Header */}
            <div className="relative overflow-hidden pt-20 pb-24">
                <div ref={headerRef} className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <p className="text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase text-sm mb-4">Our Mission</p>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Making Shared Finances <span className="text-transparent bg-clip-text text-gradient-clay">Seamless</span></h1>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Splitify was created to remove the awkwardness of asking friends for money.
                        We believe that keeping track of shared expenses should be as beautiful as the memories you're making together.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div ref={valuesRef} className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value, i) => (
                        <div key={i} className="value-card p-8 rounded-[36px] bg-clay-card shadow-clayCard backdrop-blur-xl hover:-translate-y-2 transition-all duration-300 border-t border-white/40 dark:border-white/5">
                            <div className="w-14 h-14 rounded-[18px] gradient-brand flex items-center justify-center text-white mb-6 shadow-clayBtn">
                                <value.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{value.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-sm">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Journey */}
            <div ref={storyRef} className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <p className="text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase text-sm mb-3">Our Journey</p>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">From Frustration to Solution</h2>
                </div>
                <div className="space-y-6">
                    {team.map((item, i) => (
                        <div key={i} className="story-card flex items-start gap-6 p-6 rounded-[28px] bg-clay-card shadow-clayCard border-t border-white/40 dark:border-white/5">
                            <div className="text-4xl flex-shrink-0">{item.emoji}</div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1">{item.name}</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom message */}
            <div className="max-w-3xl mx-auto px-4 text-center pt-8">
                <div className="p-8 rounded-[36px] bg-clay-card shadow-clayCard border-t border-white/40 dark:border-white/5">
                    <Heart className="w-8 h-8 text-brand-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                        We built Splitify to be the ultimate companion for roommates, travelers, and friends. By providing a beautiful, robust platform,
                        we ensure you can focus on enjoying your time together, while we handle the math in the background.
                    </p>
                </div>
            </div>
        </div>
    );
}
