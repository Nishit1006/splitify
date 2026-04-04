import { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'sonner';
import gsap from 'gsap';

export default function ContactPage() {
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
            );
        }
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
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 w-full" ref={containerRef}>
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400">
                    Have a question, feedback, or need support? We'd love to hear from you. Drop us a message below.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="p-8 rounded-2xl glass-card border border-gray-200/60 dark:border-gray-700/40">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 text-white shadow-brand-500/20">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Email Us</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">support@splitify.com</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 text-white shadow-brand-500/20">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Visit Us</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">123 Splitify Lane, Tech District<br/>San Francisco, CA 94105</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 text-white shadow-brand-500/20">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Call Us</h4>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="p-8 rounded-2xl glass-card border border-gray-200/60 dark:border-gray-700/40 shadow-glow-sm">
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
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 resize-none transition-all duration-200"
                                placeholder="Write your message here..."
                            />
                        </div>

                        <Button type="submit" loading={loading} className="w-full py-3" size="lg">
                            Send Message <Send className="w-4 h-4 ml-1" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
