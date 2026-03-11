import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { User, Mail, Lock, AtSign, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function SignupPage() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
        if (!form.username.trim()) errs.username = 'Username is required';
        else if (form.username.length < 3) errs.username = 'At least 3 characters';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 6) errs.password = 'At least 6 characters';
        if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await register({
                fullName: form.fullName,
                email: form.email,
                username: form.username,
                password: form.password,
            });
            toast.success('OTP sent to your email!');
            navigate('/verify-email', { state: { email: form.email } });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 gradient-brand items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-40 left-10 w-80 h-80 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-300 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 text-white max-w-md">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-8">
                        <span className="text-3xl font-bold">S</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Join Splitify<br />today.</h1>
                    <p className="text-lg text-white/80">
                        Create an account and start splitting expenses with your groups effortlessly.
                    </p>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Splitify</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        Fill in the details to get started
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Input
                                label="Full Name"
                                placeholder="John Doe"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                error={errors.fullName}
                            />
                            <User className="absolute right-3 top-[38px] w-4 h-4 text-gray-400" />
                        </div>

                        <div className="relative">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                error={errors.email}
                            />
                            <Mail className="absolute right-3 top-[38px] w-4 h-4 text-gray-400" />
                        </div>

                        <div className="relative">
                            <Input
                                label="Username"
                                placeholder="johndoe"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                error={errors.username}
                            />
                            <AtSign className="absolute right-3 top-[38px] w-4 h-4 text-gray-400" />
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

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            error={errors.confirmPassword}
                        />

                        <Button type="submit" loading={loading} className="w-full" size="lg">
                            Create Account <ArrowRight className="w-4 h-4" />
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
