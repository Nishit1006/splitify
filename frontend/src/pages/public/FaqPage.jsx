import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';

const faqs = [
    {
        question: "How does Splitify handle exact amounts vs percentages?",
        answer: "Splitify gives you total flexibility. When creating an expense, you can choose to split equally, specify an exact amount for each person, or assign percentages. Our algorithm ensures everything always adds up to 100% or the exact total bill."
    },
    {
        question: "Can I upload payment proof?",
        answer: "Yes! When settling a debt or logging a bill, you can upload an image of the receipt or screenshot of your Venmo/Zelle payment. It stays securely stored and attached to the settlement record for transparent proof."
    },
    {
        question: "Is Splitify free to use?",
        answer: "Absolutely. Splitify's core functionality—creating groups, logging expenses, and calculating debts—is 100% free with no ads. We plan to offer premium specialized features in the future, but the basics will always be free."
    },
    {
        question: "How do group links work?",
        answer: "Group admins can generate a secure invite link to share via WhatsApp, iMessage, or email. Anyone who clicks the link (and makes an account) will automatically be joined into your group."
    },
    {
        question: "Does Splitify automatically move money between accounts?",
        answer: "No, Splitify is a ledger and calculator. It tells you exactly who owes whom, but the actual transfer of funds happens externally via your preferred payment app (CashApp, PayPal, bank transfer, etc.). Once paid, simply log a 'Settlement' inside Splitify."
    }
];

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const listRef = useRef(null);

    useEffect(() => {
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
            );
        }
    }, []);

    const toggleOpen = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 lg:px-8 py-20 w-full min-h-[70vh]">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    Everything you need to know about using Splitify effectively.
                </p>
            </div>

            <div className="space-y-4" ref={listRef}>
                {faqs.map((faq, i) => (
                    <div 
                        key={i} 
                        className={`rounded-2xl glass-card border transition-all duration-300 overflow-hidden ${openIndex === i ? 'border-brand-300 dark:border-brand-700 shadow-glow-sm' : 'border-gray-200/60 dark:border-gray-700/40 hover:border-gray-300 dark:hover:border-gray-600'}`}
                    >
                        <button 
                            className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                            onClick={() => toggleOpen(i)}
                        >
                            <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIndex === i ? 'rotate-180 text-brand-500' : ''}`} />
                        </button>
                        
                        <div 
                            className={`px-6 text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-all duration-300 ${openIndex === i ? 'pb-6 opacity-100 max-h-[500px]' : 'max-h-0 opacity-0 overflow-hidden pb-0'}`}
                        >
                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800/80">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
