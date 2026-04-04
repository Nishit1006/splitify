import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../lib/api';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function RejectInvitePage() {
    const { token } = useParams(); // FIXED: Matches router parameter
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const rejectInvite = async () => {
            try {
                await api.post(`/invitations/reject/${token}`);
                if (isMounted) {
                    setStatus('success');
                    setMessage('You have successfully declined the invitation.');
                }
            } catch (error) {
                if (isMounted) {
                    setStatus('error');
                    setMessage(error.response?.data?.message || 'Failed to reject invitation. It may be invalid or already processed.');
                }
            }
        };

        rejectInvite();

        return () => {
            isMounted = false;
        };
    }, [token]);

    // ... Keep the return JSX exactly the same
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="py-10 flex flex-col items-center text-center">
                    {status === 'loading' && (
                        <>
                            <Loader2 className="w-12 h-12 text-brand-500 animate-spin mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Processing</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invitation Declined</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">{message}</p>
                            <Button className="mt-6" onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <XCircle className="w-12 h-12 text-red-500 mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Error</h2>
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
