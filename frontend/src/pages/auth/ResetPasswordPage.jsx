import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Lock, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import gsap from 'gsap';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        if (password !== confirmPassword) { toast.error('Passwords don\'t match'); return; }
        setLoading(true);
        try {
            await resetPassword(token, password);
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
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
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1.5 tracking-tight">Set new password</h2>
                    <p className="text-gray-500 dark:text-gray-400">Choose a strong password for your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input label="New Password" type="password" placeholder="••••••••" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    <Input label="Confirm Password" type="password" placeholder="••••••••" value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Button type="submit" loading={loading} className="w-full" size="lg">
                        Reset Password <ArrowRight className="w-4 h-4" />
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
