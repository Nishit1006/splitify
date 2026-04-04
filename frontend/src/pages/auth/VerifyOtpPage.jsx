import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import gsap from 'gsap';

export default function VerifyOtpPage() {
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';
    const containerRef = useRef(null);

    const [email, setEmail] = useState(emailFromState);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !otp) { toast.error('Email and OTP are required'); return; }
        setLoading(true);
        try {
            await verifyOtp({ email, otp });
            toast.success('Email verified! You can now sign in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] dark:bg-[#0B1120] relative">
            <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark pointer-events-none" />
            <div ref={containerRef} className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight">Verify your email</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        We sent a 6-digit OTP to{' '}
                        {emailFromState ? (
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{emailFromState}</span>
                        ) : 'your email'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!emailFromState && (
                        <Input label="Email" type="email" placeholder="you@example.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    )}
                    <Input label="OTP Code" placeholder="123456" value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-2xl tracking-[0.5em] font-mono" maxLength={6} />
                    <Button type="submit" loading={loading} className="w-full" size="lg">
                        Verify Email <ArrowRight className="w-4 h-4" />
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                    <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                        Back to Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
