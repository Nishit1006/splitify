import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function PublicFooter() {
    return (
        <footer className="mt-20 rounded-t-[64px] bg-clay-card shadow-[0_-20px_60px_rgba(0,0,0,0.03)] dark:shadow-[0_-20px_60px_rgba(0,0,0,0.2)] overflow-hidden relative border-0">
            <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark pointer-events-none opacity-50" />
            
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5 group w-fit">
                            <div className="w-10 h-10 gradient-brand rounded-[16px] flex items-center justify-center shadow-clayBtn">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-black font-heading text-gray-900 dark:text-white tracking-tight">
                                Splitify
                            </span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                            The smartest way to split expenses with friends, roommates, and travel buddies. No more awkward "you owe me" conversations.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="/about" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
                            <li><Link to="/faq" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">FAQs</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-200/60 dark:border-gray-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © {new Date().getFullYear()} Splitify. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        Made with <Heart className="w-4 h-4 text-brand-500 fill-brand-500" /> for seamless splitting
                    </p>
                </div>
            </div>
        </footer>
    );
}
