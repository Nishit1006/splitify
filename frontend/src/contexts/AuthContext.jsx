import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await api.get('/users/me');
            setUser(data.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (credentials) => {
        const { data } = await api.post('/users/login', credentials);
        setUser(data.data.user);
        return data;
    };

    const register = async (formData) => {
        const { data } = await api.post('/users/register', formData);
        return data;
    };

    const verifyOtp = async (payload) => {
        const { data } = await api.post('/users/verify-email-otp', payload);
        return data;
    };

    const forgotPassword = async (email) => {
        const { data } = await api.post('/users/forgot-password', { email });
        return data;
    };

    const resetPassword = async (token, newPassword) => {
        const { data } = await api.post(`/users/reset-password/${token}`, { newPassword });
        return data;
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
        } catch {
            // ignore
        }
        setUser(null);
    };

    const updateProfile = async (details) => {
        const { data } = await api.patch('/users/update', details);
        setUser(data.data);
        return data;
    };

    const changePassword = async (oldPassword, newPassword) => {
        const { data } = await api.patch('/users/change-password', { oldPassword, newPassword });
        return data;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                verifyOtp,
                forgotPassword,
                resetPassword,
                logout,
                updateProfile,
                changePassword,
                refreshUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
