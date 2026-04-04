import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';
import {
    User, Mail, Moon, Sun, Lock, LogOut, Save, Shield, Sparkles
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';
import gsap from 'gsap';

export default function ProfilePage() {
    const { user, updateProfile, changePassword, logout } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    const [profile, setProfile] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '', newPassword: '', confirmPassword: '',
    });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }
            );
        }
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!profile.fullName.trim()) { toast.error('Full name is required'); return; }
        setLoadingProfile(true);
        try {
            await updateProfile({ fullName: profile.fullName });
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passwords.oldPassword || !passwords.newPassword) { toast.error('All fields are required'); return; }
        if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords don\'t match'); return; }
        if (passwords.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoadingPassword(true);
        try {
            await changePassword(passwords.oldPassword, passwords.newPassword);
            toast.success('Password changed!');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoadingPassword(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div ref={containerRef} className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    Profile <User className="w-6 h-6 text-brand-500" />
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">Manage your account settings</p>
            </div>

            {/* User Info Card */}
            <Card className="overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-brand-500 via-violet-500 to-purple-500 relative">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 right-10 w-20 h-20 bg-white rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-10 w-16 h-16 bg-indigo-300 rounded-full blur-2xl" />
                    </div>
                </div>
                <CardContent className="relative">
                    <div className="flex items-end gap-4 -mt-10">
                        <div className="ring-4 ring-white dark:ring-gray-900 rounded-full">
                            <Avatar name={user?.fullName} size="xl" />
                        </div>
                        <div className="pb-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username} · {user?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-500" /> Appearance
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${dark
                                ? 'bg-gradient-to-r from-brand-500 to-violet-500 shadow-lg shadow-brand-500/25'
                                : 'bg-gray-300'
                                }`}
                        >
                            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center ${dark ? 'translate-x-7' : 'translate-x-0.5'
                                }`}>
                                {dark ? <Moon className="w-3.5 h-3.5 text-brand-600" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                            </div>
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-brand-500" /> Edit Profile
                    </h3>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <Input label="Full Name" value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} />
                        <Input label="Email" type="email" value={profile.email} disabled={true}
                            className="opacity-60 cursor-not-allowed" />
                        <p className="text-xs text-gray-500 -mt-2 pb-2">Email cannot be changed for security reasons.</p>
                        <Button type="submit" loading={loadingProfile} size="sm">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-4 h-4 text-brand-500" /> Change Password
                    </h3>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <Input label="Current Password" type="password" value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} placeholder="••••••••" />
                        <Input label="New Password" type="password" value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} placeholder="••••••••" />
                        <Input label="Confirm New Password" type="password" value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} placeholder="••••••••" />
                        <Button type="submit" loading={loadingPassword} size="sm" variant="secondary">
                            <Lock className="w-4 h-4" /> Update Password
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Logout */}
            <Card>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sign Out</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sign out of your Splitify account</p>
                        </div>
                        <Button variant="danger" size="sm" onClick={handleLogout}>
                            <LogOut className="w-4 h-4" /> Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
