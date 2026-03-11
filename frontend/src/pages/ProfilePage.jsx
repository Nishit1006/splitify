import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';
import {
    User, Mail, AtSign, Moon, Sun, Lock, LogOut, Save, Shield,
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Avatar from '../components/ui/Avatar';

export default function ProfilePage() {
    const { user, updateProfile, changePassword, logout } = useAuth();
    const { dark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
    });
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!profile.fullName.trim() || !profile.email.trim()) {
            toast.error('All fields are required');
            return;
        }
        setLoadingProfile(true);
        try {
            await updateProfile(profile);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!passwords.oldPassword || !passwords.newPassword) {
            toast.error('All fields are required');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Passwords don\'t match');
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
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
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Manage your account settings
                </p>
            </div>

            {/* User Info Card */}
            <Card>
                <CardContent className="py-6">
                    <div className="flex items-center gap-4">
                        <Avatar name={user?.fullName} size="xl" />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{user?.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} Appearance
                    </h3>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Toggle between light and dark theme
                            </p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${dark ? 'bg-brand-600' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${dark ? 'translate-x-7' : 'translate-x-0.5'
                                    }`}
                            />
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile */}
            <Card>
                <CardHeader>
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <User className="w-4 h-4" /> Edit Profile
                    </h3>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <Input
                            label="Full Name"
                            value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                        <Button type="submit" loading={loadingProfile} size="sm">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
                <CardHeader>
                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Change Password
                    </h3>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <Input
                            label="Current Password"
                            type="password"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                            placeholder="••••••••"
                        />
                        <Input
                            label="New Password"
                            type="password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            placeholder="••••••••"
                        />
                        <Input
                            label="Confirm New Password"
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                        />
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
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Sign out of your Splitify account
                            </p>
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
