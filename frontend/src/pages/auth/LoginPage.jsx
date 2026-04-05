import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import gsap from 'gsap';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);
    const formRef = useRef(null);
    const heroRef = useRef(null);

    useEffect(() => {
        if (formRef.current) {
            gsap.fromTo(
                formRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
            );
        }
        if (heroRef.current) {
            gsap.fromTo(
                heroRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, []);

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = 'Email or username is required';
        if (!form.password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await login({
                email: form.email.includes('@') ? form.email : undefined,
                username: !form.email.includes('@') ? form.email : undefined,
                password: form.password,
            });
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel — branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-violet-600 to-purple-700" />
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                </div>
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
                <div ref={heroRef} className="relative z-10 flex items-center justify-center p-12 w-full">
                    <div className="text-white max-w-md">
                        <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 shadow-lg border border-white/10">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4 tracking-tight leading-tight">
                            Split smart,<br />settle fast.
                        </h1>
                        <p className="text-lg text-white/70 leading-relaxed">
                            Track shared expenses, simplify balances, and settle up with friends — all in one beautiful place.
                        </p>
                        <div className="flex items-center gap-3 mt-8">
                            <div className="flex -space-x-2">
                                {['A', 'B', 'C', 'D'].map((l, i) => (
                                    <div key={l} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-xs font-bold"
                                        style={{ animationDelay: `${i * 0.1}s` }}>
                                        {l}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-white/60">Trusted by 10K+ users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-clay-bg relative">
                <div className="absolute inset-0 gradient-mesh dark:gradient-mesh-dark pointer-events-none opacity-60" />
                <div ref={formRef} className="w-full max-w-md relative z-10">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2.5 mb-8">
                        <div className="w-10 h-10 gradient-brand rounded-[16px] flex items-center justify-center shadow-clayBtn">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-black font-heading text-gray-900 dark:text-white tracking-tight">Splitify</span>
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-1.5 tracking-tight">Welcome back</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Sign in to your account to continue
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <Input
                                label="Email or Username"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                error={errors.email}
                            />
                            <Mail className="absolute right-3 top-[38px] w-4 h-4 text-gray-400" />
                        </div>

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPwd ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                error={errors.password}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Sign In <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
