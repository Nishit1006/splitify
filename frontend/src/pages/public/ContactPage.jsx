import { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Phone, Send, Clock, MessageCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'sonner';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
    { icon: Mail, title: 'Email Us', detail: 'support@splitify.com', sub: 'We respond within 24 hours' },
    { icon: MapPin, title: 'Visit Us', detail: '123 Splitify Lane, Tech District', sub: 'San Francisco, CA 94105' },
    { icon: Phone, title: 'Call Us', detail: '+1 (555) 123-4567', sub: 'Mon-Fri, 9AM to 6PM PST' },
    { icon: Clock, title: 'Business Hours', detail: 'Monday — Friday', sub: '9:00 AM — 6:00 PM PST' },
];

export default function ContactPage() {
    const headerRef = useRef(null);
    const formRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (headerRef.current) {
                gsap.fromTo(headerRef.current.children,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
                );
            }
            if (formRef.current) {
                gsap.fromTo('.contact-card',
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out',
                      scrollTrigger: { trigger: formRef.current, start: 'top 85%', once: true } }
                );
            }
        });
        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Message sent successfully! We'll get back to you soon.");
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 w-full">
            {/* Header */}
            <div ref={headerRef} className="text-center mb-16 max-w-2xl mx-auto">
                <p className="text-brand-600 dark:text-brand-400 font-bold tracking-widest uppercase text-sm mb-3">Get in Touch</p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">We'd love to hear from you</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
                    Have a question, feedback, or need support? Drop us a message below and we'll get back to you within 24 hours.
                </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {contactInfo.map((item, i) => (
                    <div key={i} className="contact-card p-6 rounded-[28px] bg-clay-card shadow-clayCard border-t border-white/40 dark:border-white/5 text-center hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-[16px] gradient-brand flex items-center justify-center text-white mx-auto mb-4 shadow-clayBtn">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                        <p className="text-brand-600 dark:text-brand-400 font-bold text-sm mt-1">{item.detail}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">{item.sub}</p>
                    </div>
                ))}
            </div>

            {/* Contact Form */}
            <div ref={formRef} className="max-w-2xl mx-auto">
                <div className="contact-card p-8 sm:p-10 rounded-[36px] bg-clay-card shadow-clayCard backdrop-blur-xl border-t border-white/40 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-[14px] gradient-brand flex items-center justify-center shadow-sm">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Send us a message</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Fill out the form below and we'll respond promptly</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="First Name" placeholder="John" required />
                            <Input label="Last Name" placeholder="Doe" required />
                        </div>
                        <Input label="Email Address" type="email" placeholder="john@example.com" required />
                        <Input label="Subject" placeholder="How can we help?" required />

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Message
                            </label>
                            <textarea
                                required
                                rows={5}
                                className="w-full px-6 py-4 rounded-[20px] border-0 bg-clay-input text-base shadow-clayPressed text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-brand-500/20 resize-none transition-all duration-200"
                                placeholder="Write your message here..."
                            />
                        </div>

                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Send Message <Send className="w-4 h-4 ml-1" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
