import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AcceptInvitePage() {
    const { token } = useParams(); // FIXED: Matches router parameter
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const acceptInvite = async () => {
            try {
                const { data } = await api.post(`/invitations/accept/${token}`);
                if (isMounted) {
                    setStatus('success');
                    setMessage('You have successfully joined the group!');
                    setTimeout(() => {
                        navigate(`/groups/${data.data.groupId}`);
                    }, 2000);
                }
            } catch (error) {
                if (isMounted) {
                    const errorMsg = error.response?.data?.message || '';
                    if (errorMsg.includes('already a member')) {
                        setStatus('success');
                        setMessage('You are already a member of this group!');
                        setTimeout(() => {
                            navigate('/groups');
                        }, 2000);
                    } else {
                        setStatus('error');
                        setMessage(errorMsg || 'Failed to accept invitation. It may be invalid or expired.');
                    }
                }
            }
        };

        acceptInvite();

        return () => {
            isMounted = false;
        };
    }, [token, navigate]);

    // ... Keep the return JSX exactly the same
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="py-10 flex flex-col items-center text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Processing Invitation</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we add you to the group...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invitation Processed!</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">{message}</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">Redirecting...</p>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invitation Failed</h2>
                            <p className="text-red-500 dark:text-red-400 mt-2">{message}</p>
                            <Button className="mt-6" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
