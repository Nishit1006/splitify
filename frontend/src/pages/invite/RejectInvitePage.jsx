import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Users } from 'lucide-react';
import api from '../../lib/api';
import Button from '../../components/ui/Button';

export default function RejectInvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function reject() {
            try {
                const { data } = await api.post(`/invitations/reject/${token}`);
                if (!cancelled) {
                    setStatus('success');
                    setMessage(data.message || 'Invitation declined.');
                }
            } catch (err) {
                if (!cancelled) {
                    setStatus('error');
                    const msg = err.response?.data?.message || 'Something went wrong';
                    setMessage(msg);
                }
            }
        }

        reject();
        return () => { cancelled = true; };
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="h-1.5 bg-gray-300 dark:bg-gray-700" />

                    <div className="px-8 py-10 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>

                        {status === 'loading' && (
                            <>
                                <Loader2 className="w-10 h-10 text-gray-400 animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Declining Invitation
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Please wait…
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Invitation Declined
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

                        {status === 'error' && (
                            <>
                                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Something Went Wrong
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

                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
                    Splitify — Split smart, settle fast.
                </p>
            </div>
        </div>
    );
}
