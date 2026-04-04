import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Receipt, ArrowRight, Zap, PieChart, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import gsap from 'gsap';

export default function LandingPage() {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            gsap.fromTo('.hero-elem', 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
            );

            // Features animation
            gsap.fromTo('.feature-card',
                { opacity: 0, y: 40 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6, 
                    stagger: 0.1, 
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: featuresRef.current,
                        start: 'top 80%'
                    }
                }
            );
        }, [heroRef, featuresRef]);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: Users,
            title: 'Group Splitting',
            description: 'Create trips, house groups, or event squads. Add members easily via email or shareable links.'
        },
        {
            icon: Receipt,
            title: 'Expense Tracking',
            description: 'Log every receipt with smart equal or custom percentage splits. Attach proof of bills directly.'
        },
        {
            icon: Zap,
            title: 'Instant Settlements',
            description: 'Record payments inside Splitify quickly so everyone instantly knows their net balance.'
        },
        {
            icon: PieChart,
            title: 'Smart Analytics',
            description: 'See exactly who owes who with our automated debt simplification algorithm.'
        }
    ];

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section ref={heroRef} className="pt-20 pb-32 px-4 lg:px-8 max-w-7xl mx-auto relative">
                {/* Decorative blobs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="text-center relative z-10 max-w-4xl mx-auto">
                    <div className="hero-elem inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-200/60 dark:border-brand-800/40 mb-8 max-w-fit mx-auto text-sm font-medium text-brand-700 dark:text-brand-300">
                        <Sparkles className="w-4 h-4 text-brand-500" />
                        Splitify v2.0 is here!
                    </div>
                    
                    <h1 className="hero-elem text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                        Split expenses, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text gradient-brand">keep friendships.</span>
                    </h1>
                    
                    <p className="hero-elem text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                        The smartest way to track shared costs for trips, houses, and friends. We do the math, so you don't have to.
                    </p>
                    
                    <div className="hero-elem flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg" variant="glow" className="w-full sm:w-auto h-14 px-8 text-base shadow-brand-500/25">
                                Get Started for Free <ArrowRight className="w-5 h-5 ml-1" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto h-14 px-8 text-base">
                                Already have an account?
                            </Button>
                        </Link>
                    </div>

                    {/* Preview Dashboard Image mockup placeholder */}
                    <div className="hero-elem mt-20 relative mx-auto w-full max-w-5xl pl-4 pr-4">
                        <div className="rounded-2xl glass-card overflow-hidden border border-gray-200/80 dark:border-gray-700/60 shadow-2xl shadow-brand-500/10 h-64 sm:h-96 w-full flex items-center justify-center bg-gray-50/50 dark:bg-gray-800/30">
                            <p className="text-brand-600/50 dark:text-brand-400/50 font-medium text-lg flex items-center gap-2">
                                <Sparkles className="w-6 h-6" /> Premium Dashboard Included
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className="py-24 bg-white/50 dark:bg-gray-900/40 relative">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Everything you need to settle up</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            We've built all the tools required to ensure everyone pays their fair share, completely transparently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="feature-card p-6 rounded-2xl glass-card border border-gray-200/60 dark:border-gray-700/40 hover:border-brand-300 dark:hover:border-brand-500/50 transition-colors duration-300 group">
                                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-brand-500/20">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section ref={ctaRef} className="py-24 px-4 lg:px-8 max-w-5xl mx-auto text-center relative">
               <div className="p-12 md:p-20 rounded-3xl gradient-brand relative overflow-hidden shadow-2xl shadow-brand-500/30">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    
                    <div className="relative z-10">
                        <ShieldCheck className="w-16 h-16 text-white mx-auto mb-6 drop-shadow-md" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to split smart?</h2>
                        <p className="text-brand-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            Join thousands of users who have simplified their debt reporting and saved money using Splitify.
                        </p>
                        <Link to="/signup">
                            <button className="bg-white text-brand-600 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
                                Start Splitting Now
                            </button>
                        </Link>
                    </div>
               </div>
            </section>
        </div>
    );
}
