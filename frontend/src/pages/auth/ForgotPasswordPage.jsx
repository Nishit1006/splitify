import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import gsap from 'gsap';

export default function ForgotPasswordPage() {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) { toast.error('Email is required'); return; }
        setLoading(true);
        try {
            await forgotPassword(email);
            setSent(true);
            toast.success('Reset link sent!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-clay-bg relative">
            <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark pointer-events-none" />
            <div ref={containerRef} className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight">
                        {sent ? 'Check your email' : 'Forgot password?'}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {sent
                            ? 'We sent a password reset link to your email.'
                            : 'Enter your email and we\'ll send you a reset link.'}
                    </p>
                </div>

                {!sent ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input label="Email" type="email" placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Send Reset Link <Send className="w-4 h-4" />
                        </Button>
                    </form>
                ) : (
                    <div className="bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-5 text-center">
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            If an account with that email exists, you'll receive a reset link shortly.
                        </p>
                    </div>
                )}

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                    <Link to="/login" className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
