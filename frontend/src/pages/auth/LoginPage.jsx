import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

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
            <div className="hidden lg:flex lg:w-1/2 gradient-brand items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-300 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 text-white max-w-md">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                        <span className="text-3xl font-bold">S</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Split smart,<br />settle fast.</h1>
                    <p className="text-lg text-white/80">
                        Track shared expenses, simplify balances, and settle up with friends — all in one place.
                    </p>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Splitify</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h2>
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
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                            >
                                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Sign In <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
