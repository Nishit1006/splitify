import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
    { question: "How does Splitify handle exact amounts vs percentages?", answer: "Splitify gives you total flexibility. When creating an expense, you can choose to split equally, specify an exact amount for each person, or assign percentages. Our algorithm ensures everything always adds up to 100% or the exact total bill." },
    { question: "Can I upload payment proof?", answer: "Yes! When settling a debt or logging a bill, you can upload an image of the receipt or screenshot of your Venmo/Zelle payment. It stays securely stored and attached to the settlement record for transparent proof." },
    { question: "Is Splitify free to use?", answer: "Absolutely. Splitify's core functionality — creating groups, logging expenses, and calculating debts — is 100% free with no ads. We plan to offer premium specialized features in the future, but the basics will always be free." },
    { question: "How do group links work?", answer: "Group admins can generate a secure invite link to share via WhatsApp, iMessage, or email. Anyone who clicks the link (and makes an account) will automatically be joined into your group." },
    { question: "Does Splitify automatically move money between accounts?", answer: "No, Splitify is a ledger and calculator. It tells you exactly who owes whom, but the actual transfer of funds happens externally via your preferred payment app (CashApp, PayPal, bank transfer, etc.). Once paid, simply log a 'Settlement' inside Splitify." },
    { question: "How does the debt simplification algorithm work?", answer: "Instead of everyone paying each other individually, our algorithm reduces the total number of transactions needed. For example, in a group of 5, instead of 10 possible payments, we simplify it to just 3 or 4 optimal transactions." },
    { question: "Can I use Splitify for business expenses?", answer: "While Splitify is designed primarily for personal expense splitting, many small teams use it for team lunches, shared subscriptions, and project expenses. For enterprise needs, contact us for a custom solution." },
];

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const headerRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.fromTo(headerRef.current.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                );
            }
            if (listRef.current) {
                gsap.fromTo('.faq-card',
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out',
                      scrollTrigger: { trigger: listRef.current, start: 'top 85%', once: true } }
                );
            }
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-20 w-full min-h-[70vh]">
            {/* Header */}
            <div ref={headerRef} className="text-center mb-16">
                <p className="text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase text-sm mb-3">Support</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">Frequently Asked Questions</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                    Everything you need to know about using Splitify effectively.
                </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-4" ref={listRef}>
                {faqs.map((faq, i) => (
                    <div
                        key={i}
                        className={`faq-card rounded-[28px] bg-clay-card transition-all duration-300 overflow-hidden border-t border-white/40 dark:border-white/5 ${openIndex === i ? 'shadow-clayPressed scale-[0.98]' : 'shadow-clayCard hover:-translate-y-1'}`}
                    >
                        <button
                            className="w-full px-7 py-5 flex items-center justify-between text-left focus:outline-none clay-btn-press"
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        >
                            <span className="font-bold text-gray-900 dark:text-white pr-4 leading-tight">{faq.question}</span>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === i ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400' : 'bg-clay-input text-gray-400'}`}>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        <div className={`px-7 text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed transition-all duration-300 ${openIndex === i ? 'pb-6 opacity-100 max-h-[500px]' : 'max-h-0 opacity-0 overflow-hidden pb-0'}`}>
                            <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="mt-16 text-center p-8 rounded-[32px] bg-clay-card shadow-clayCard border-t border-white/40 dark:border-white/5">
                <MessageCircle className="w-8 h-8 text-brand-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Still have questions?</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-6">Can't find what you're looking for? Our support team is here to help.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-[16px] gradient-brand text-white font-bold shadow-clayBtn clay-btn-press hover:-translate-y-1 transition-all duration-300">
                    Contact Support
                </Link>
            </div>
        </div>
    );
}
