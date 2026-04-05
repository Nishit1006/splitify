import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Receipt, ArrowRight, Zap, PieChart, Sparkles, ChevronDown, CheckCircle, UploadCloud, Wallet, Globe, Lock, Heart, Star, MessageCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ────────────────────────────────────────────── */
const features = [
    { icon: Users, title: 'Group Splitting', description: 'Create trips, house groups, or event squads. Add members easily via email or shareable links. Supports unlimited group members.' },
    { icon: Receipt, title: 'Expense Tracking', description: 'Log every receipt with smart equal or custom percentage splits. Attach proof of bills directly for full transparency.' },
    { icon: Zap, title: 'Instant Settlements', description: 'Record payments inside Splitify quickly so everyone instantly knows their net balance. Zero delays, zero confusion.' },
    { icon: PieChart, title: 'Smart Analytics', description: 'See exactly who owes who with our automated debt simplification algorithm. Beautiful charts and exportable reports.' },
    { icon: Globe, title: 'Multi-Currency', description: 'Traveling abroad? Splitify handles currency conversion automatically so your group can split expenses in any currency.' },
    { icon: Lock, title: 'Bank-Grade Security', description: 'Your financial data is encrypted end-to-end. We never sell your data and use industry-standard security practices.' },
];

const steps = [
    { num: '01', icon: Users, title: 'Create a Group', desc: 'Set up a group for your trip, apartment, dinner, or event. Invite friends with a simple shareable link or email.' },
    { num: '02', icon: UploadCloud, title: 'Add Expenses', desc: 'Snap a photo of a receipt or manually log an expense. Choose equal split, custom amounts, or percentages.' },
    { num: '03', icon: CheckCircle, title: 'Settle Up', desc: 'Our algorithm simplifies all debts into the fewest possible transactions. Mark payments as you go.' },
];

const testimonials = [
    { name: 'Priya Sharma', role: 'Frequent Traveler', text: 'Splitify completely eliminated the awkward "who owes what" conversations from our group trips. Best expense app I\'ve ever used!', rating: 5 },
    { name: 'Rahul Verma', role: 'Roommate', text: 'We use Splitify for all our apartment expenses — rent, groceries, utilities. The debt simplification is pure genius.', rating: 5 },
    { name: 'Ananya Das', role: 'Event Organizer', text: 'Organized a 50-person reunion and tracked every expense through Splitify. Settled everything in one day. Incredible.', rating: 5 },
];

const faqs = [
    { question: "How does Splitify handle different split types?", answer: "Splitify gives you total flexibility. When creating an expense, you can choose to split equally, specify an exact amount for each person, or assign custom percentages. Our algorithm ensures everything always adds up correctly." },
    { question: "Can I upload payment proof?", answer: "Yes! When settling a debt or logging a bill, you can upload an image of the receipt or a screenshot of your payment confirmation. It stays securely stored and attached to the settlement record for complete transparency." },
    { question: "Is Splitify completely free?", answer: "Absolutely. Splitify's core functionality — creating groups, logging expenses, and calculating debts — is 100% free with no advertisements. We believe financial tools should be accessible to everyone." },
    { question: "Does Splitify move money between accounts?", answer: "No, Splitify is a ledger and calculator. It tells you exactly who owes whom, but the actual transfer of funds happens externally via your preferred payment app (UPI, PayPal, bank transfer, etc.). Once paid, simply log a 'Settlement' inside Splitify." },
    { question: "How does the debt simplification algorithm work?", answer: "Instead of everyone paying each other individually, our algorithm reduces the total number of transactions needed to settle all debts. For example, in a group of 5, instead of 10 possible payments, we might simplify it to just 3 or 4." },
];

const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '₹2Cr+', label: 'Expenses Tracked' },
    { value: '50K+', label: 'Groups Created' },
    { value: '99.9%', label: 'Uptime' },
];

/* ─── Component ───────────────────────────────────────── */
export default function LandingPage() {
    const heroRef = useRef(null);
    const statsRef = useRef(null);
    const hiwRef = useRef(null);
    const featuresRef = useRef(null);
    const testimonialsRef = useRef(null);
    const faqRef = useRef(null);
    const ctaRef = useRef(null);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── Hero Entrance ── */
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            heroTl
                .fromTo('.hero-badge', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6 })
                .fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
                .fromTo('.hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
                .fromTo('.hero-btns', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
                .fromTo('.hero-preview', { opacity: 0, y: 60, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.3');

            /* ── Floating Objects (infinite) ── */
            gsap.to('.float-obj-1', { y: '-=25', x: '+=10', rotation: 8, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
            gsap.to('.float-obj-2', { y: '+=20', x: '-=15', rotation: -12, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 });
            gsap.to('.float-obj-3', { y: '-=18', rotation: 15, scale: 1.04, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 });

            /* ── Stats Counter ── */
            if (statsRef.current) {
                gsap.fromTo('.stat-item', { opacity: 0, y: 30 }, {
                    opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
                    scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true }
                });
            }

            /* ── How It Works ── */
            if (hiwRef.current) {
                gsap.fromTo('.step-card', { opacity: 0, y: 40, scale: 0.9 }, {
                    opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.4)',
                    scrollTrigger: { trigger: hiwRef.current, start: 'top 75%', once: true }
                });
            }

            /* ── Features Grid ── */
            if (featuresRef.current) {
                gsap.fromTo('.feature-card', { opacity: 0, y: 40 }, {
                    opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
                    scrollTrigger: { trigger: featuresRef.current, start: 'top 80%', once: true }
                });
            }

            /* ── Testimonials ── */
            if (testimonialsRef.current) {
                gsap.fromTo('.testimonial-card', { opacity: 0, y: 30, scale: 0.95 }, {
                    opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'power2.out',
                    scrollTrigger: { trigger: testimonialsRef.current, start: 'top 80%', once: true }
                });
            }

            /* ── FAQs ── */
            if (faqRef.current) {
                gsap.fromTo('.faq-item', { opacity: 0, x: -20 }, {
                    opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out',
                    scrollTrigger: { trigger: faqRef.current, start: 'top 85%', once: true }
                });
            }

            /* ── CTA ── */
            if (ctaRef.current) {
                gsap.fromTo(ctaRef.current, { opacity: 0, y: 40 }, {
                    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
                    scrollTrigger: { trigger: ctaRef.current, start: 'top 85%', once: true }
                });
            }
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full overflow-hidden">

            {/* ════════════════════════════════════════════════════
                HERO SECTION
               ════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="pt-16 pb-32 px-4 lg:px-8 max-w-7xl mx-auto relative min-h-[90vh] flex flex-col justify-center">
                {/* Floating GSAP Objects */}
                <div className="absolute top-24 left-4 lg:left-16 float-obj-1 hidden md:flex items-center justify-center w-20 h-20 rounded-[24px] bg-clay-card shadow-clayCard backdrop-blur-xl -rotate-12 z-20 border-t border-white/40 dark:border-white/5">
                    <Receipt className="w-8 h-8 text-brand-500" />
                </div>
                <div className="absolute bottom-48 left-[18%] float-obj-2 hidden lg:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-clayBtn rotate-12 z-20">
                    <span className="text-2xl font-black text-white">₹</span>
                </div>
                <div className="absolute top-36 right-8 lg:right-24 float-obj-3 hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-clay-card shadow-clayCard backdrop-blur-xl border-t border-white/40 dark:border-white/5 z-20">
                    <div className="w-16 h-16 gradient-brand rounded-full shadow-clayPressed flex items-center justify-center">
                        <Users className="w-7 h-7 text-white" />
                    </div>
                </div>

                <div className="text-center relative z-10 max-w-4xl mx-auto">
                    <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-clayBtn bg-clay-card backdrop-blur-xl border-t border-white/40 dark:border-white/5 mb-8 text-sm font-bold text-gray-700 dark:text-gray-200 clay-btn-press">
                        <Sparkles className="w-4 h-4 text-brand-500" />
                        <span>Trusted by 10,000+ users worldwide</span>
                    </div>

                    <h1 className="hero-title text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.05]">
                        Split expenses, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text text-gradient-clay">keep friendships.</span>
                    </h1>

                    <p className="hero-sub text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                        The smartest way to track shared costs for trips, houses, and friends.
                        No more spreadsheets, no more awkward conversations. We do the math, so you don't have to.
                    </p>

                    <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-[24px]">
                                Get Started Free <ArrowRight className="w-5 h-5 ml-1" />
                            </Button>
                        </Link>
                        <Link to="/about">
                            <button className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-[24px] bg-clay-card shadow-clayCard hover:-translate-y-1 transition-all duration-300 text-gray-700 dark:text-gray-300 clay-btn-press">
                                Learn More
                            </button>
                        </Link>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="hero-preview mt-20 relative mx-auto w-full max-w-5xl">
                        <div className="rounded-[40px] shadow-clayCard h-64 sm:h-[420px] w-full flex items-center justify-center bg-clay-card backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 border-t border-white/60 dark:border-white/5 relative overflow-hidden">
                            {/* Mock dashboard UI */}
                            <div className="absolute inset-6 sm:inset-8 flex flex-col gap-3 sm:gap-4">
                                <div className="flex gap-3">
                                    {['Net: ₹2,450', 'You Owe: ₹800', 'Owed: ₹3,250'].map((t, i) => (
                                        <div key={i} className="flex-1 rounded-[16px] bg-white/60 dark:bg-white/5 shadow-clayPressed p-3 sm:p-4">
                                            <div className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">{t.split(':')[0]}</div>
                                            <div className={`text-sm sm:text-lg font-black mt-1 ${i === 1 ? 'text-red-500' : 'text-emerald-500'}`}>{t.split(':')[1]}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 rounded-[16px] bg-white/60 dark:bg-white/5 shadow-clayPressed p-3 sm:p-4">
                                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-3">Recent Activity</div>
                                    {['Dinner at Olive Garden — ₹1,200', 'Uber to Airport — ₹350', 'Hotel Booking — ₹4,500'].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 py-1.5 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <div className="w-2 h-2 rounded-full bg-brand-400" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Decorative glow behind preview */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-brand-500/20 dark:bg-brand-500/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                STATS BAR
               ════════════════════════════════════════════════════ */}
            <section ref={statsRef} className="py-16 px-4 lg:px-8">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-item text-center p-6 rounded-[28px] bg-clay-card shadow-clayCard border-t border-white/40 dark:border-white/5">
                            <div className="text-3xl md:text-4xl font-black text-brand-600 dark:text-brand-400">{s.value}</div>
                            <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                HOW IT WORKS
               ════════════════════════════════════════════════════ */}
            <section ref={hiwRef} className="py-24 px-4 lg:px-8 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <p className="text-brand-600 dark:text-brand-400 font-bold text-sm uppercase tracking-widest mb-3">Simple Process</p>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">How It Works</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Three simple steps to financial peace of mind. No learning curve required.</p>
                </div>
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-6 relative">
                    {/* Connecting track */}
                    <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-2 bg-clay-input rounded-full -z-10 shadow-clayPressed" />

                    {steps.map((step, i) => (
                        <div key={i} className="step-card flex flex-col items-center text-center flex-1 max-w-sm mx-auto relative">
                            <div className="w-20 h-20 rounded-[28px] bg-clay-card shadow-clayCard flex items-center justify-center mb-6 border-t border-white/50 dark:border-white/5 relative">
                                <div className="w-12 h-12 rounded-[16px] gradient-brand shadow-clayBtn flex items-center justify-center">
                                    <step.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-black shadow-sm">
                                    {step.num}
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{step.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                FEATURES GRID
               ════════════════════════════════════════════════════ */}
            <section ref={featuresRef} className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <p className="text-brand-600 dark:text-brand-400 font-bold text-sm uppercase tracking-widest mb-3">Powerful Features</p>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Everything you need to settle up</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">We've built all the tools required to ensure everyone pays their fair share — completely transparently, beautifully, and effortlessly.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="feature-card p-8 rounded-[36px] bg-clay-card shadow-clayCard backdrop-blur-xl hover:-translate-y-2 transition-all duration-500 group border-t border-white/50 dark:border-white/5">
                                <div className="w-14 h-14 rounded-[18px] gradient-brand flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-clayBtn">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                TESTIMONIALS
               ════════════════════════════════════════════════════ */}
            <section ref={testimonialsRef} className="py-24 px-4 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <p className="text-brand-600 dark:text-brand-400 font-bold text-sm uppercase tracking-widest mb-3">Social Proof</p>
                        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Loved by thousands</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Don't just take our word for it. Here's what our users have to say about Splitify.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="testimonial-card p-8 rounded-[36px] bg-clay-card shadow-clayCard border-t border-white/50 dark:border-white/5 flex flex-col">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed flex-1 text-sm">"{t.text}"</p>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-black text-sm shadow-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 dark:text-white text-sm">{t.name}</p>
                                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                FAQs
               ════════════════════════════════════════════════════ */}
            <section ref={faqRef} className="py-24 px-4 lg:px-8 max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <p className="text-brand-600 dark:text-brand-400 font-bold text-sm uppercase tracking-widest mb-3">Support</p>
                    <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Got questions?</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Everything you need to know about Splitify. Can't find what you need? <Link to="/contact" className="text-brand-600 dark:text-brand-400 hover:underline">Contact us</Link>.</p>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`faq-item rounded-[28px] bg-clay-card transition-all duration-300 overflow-hidden border-t border-white/40 dark:border-white/5 ${openFaq === i ? 'shadow-clayPressed scale-[0.98]' : 'shadow-clayCard hover:-translate-y-1'}`}
                        >
                            <button
                                className="w-full px-7 py-5 flex items-center justify-between text-left focus:outline-none clay-btn-press"
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            >
                                <span className="text-base font-bold text-gray-900 dark:text-white pr-4 leading-tight">{faq.question}</span>
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openFaq === i ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400' : 'bg-clay-input text-gray-400'}`}>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </div>
                            </button>
                            <div className={`px-7 text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-sm transition-all duration-300 ${openFaq === i ? 'pb-6 opacity-100 max-h-[500px]' : 'max-h-0 opacity-0 overflow-hidden pb-0'}`}>
                                <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════
                BOTTOM CTA
               ════════════════════════════════════════════════════ */}
            <section className="pt-12 pb-32 px-4 lg:px-8 max-w-5xl mx-auto text-center relative z-10">
                <div ref={ctaRef} className="p-12 md:p-20 rounded-[56px] gradient-brand relative overflow-hidden shadow-clayCard border-t border-white/20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 mb-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xl animate-clayBreathe shadow-clayPressed border-t border-white/30">
                            <ShieldCheck className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Ready to split smart?</h2>
                        <p className="text-white/80 font-bold text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                            Join thousands of users who have simplified their shared finances. Start for free — no credit card required.
                        </p>
                        <Link to="/signup">
                            <button className="bg-white text-brand-600 h-16 sm:h-20 px-10 sm:px-14 rounded-[28px] font-black text-lg sm:text-xl shadow-clayBtn hover:shadow-clayBtnHover transition-all duration-300 clay-btn-press hover:-translate-y-1">
                                Start Splitting Now <ArrowRight className="w-5 h-5 inline ml-2" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
