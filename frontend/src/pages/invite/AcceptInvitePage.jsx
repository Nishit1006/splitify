import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Users, ArrowRight } from 'lucide-react';
import api from '../../lib/api';
import Button from '../../components/ui/Button';

export default function AcceptInvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function accept() {
            try {
                const { data } = await api.get(`/invitations/accept/${token}`);
                if (!cancelled) {
                    setStatus('success');
                    setMessage(data.message || 'You have joined the group!');
                }
            } catch (err) {
                if (!cancelled) {
                    setStatus('error');
                    const msg = err.response?.data?.message || 'Something went wrong';
                    setMessage(msg);
                }
            }
        }

        accept();
        return () => { cancelled = true; };
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Top accent bar */}
                    <div className="h-1.5 gradient-brand" />

                    <div className="px-8 py-10 flex flex-col items-center text-center">
                        {/* Logo */}
                        <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-white" />
                        </div>

                        {status === 'loading' && (
                            <>
                                <Loader2 className="w-10 h-10 text-brand-500 animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Accepting Invitation
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Please wait while we add you to the group…
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    You're In!
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    {message}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    <Button
                                        className="flex-1"
                                        onClick={() => navigate('/groups')}
                                    >
                                        View Groups <ArrowRight className="w-4 h-4" />
                                    </Button>
                                    <Link to="/" className="flex-1">
                                        <Button variant="secondary" className="w-full">
                                            Dashboard
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Invitation Failed
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    {message}
                                </p>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => navigate('/')}
                                >
                                    Go to Dashboard
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
                    Splitify — Split smart, settle fast.
                </p>
            </div>
        </div>
    );
}
