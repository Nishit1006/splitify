import { useState } from 'react';
import { Handshake, Calendar, Trash2, Image, X } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import api from '../../lib/api';
import { toast } from 'sonner';

export default function SettlementCard({ settlement, currentUserId, onDeleted }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showProof, setShowProof] = useState(false);

    const fromName = settlement.paidFrom?.username || settlement.paidFrom?.fullName || 'Deleted User';
    const toName = settlement.paidTo?.username || settlement.paidTo?.fullName || 'Deleted User';

    const isPayer = settlement.paidFrom && (
        settlement.paidFrom._id === currentUserId ||
        settlement.paidFrom._id?.toString() === currentUserId?.toString()
    );

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/settlements/${settlement._id}`);
            toast.success('Settlement deleted successfully');
            setShowConfirm(false);
            onDeleted?.(settlement._id);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete settlement');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Card hover className="group">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                <Handshake className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                                        {fromName}
                                    </span>
                                    <span className="text-gray-400 dark:text-gray-500 text-sm">paid</span>
                                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                                        {toName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDateTime(settlement.settledAt || settlement.createdAt)}
                                    </span>
                                    {settlement.paymentMethod && (
                                        <>
                                            <span className="text-gray-300 dark:text-gray-600">•</span>
                                            <span className="capitalize">{settlement.paymentMethod}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-right">
                                <p className="font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                                    {formatCurrency(settlement.amount)}
                                </p>
                                {settlement.status === 'PENDING' && (
                                    <Badge color="yellow" className="mt-1">Pending</Badge>
                                )}
                            </div>

                            {isPayer && (
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 ml-1"
                                    title="Delete settlement"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {settlement.referenceNote && (
                        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50/80 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100/80 dark:border-gray-700/40 italic">
                            "{settlement.referenceNote}"
                        </div>
                    )}

                    {settlement.proof && (
                        <div className="mt-3">
                            <button
                                onClick={() => setShowProof(true)}
                                className="group/proof flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200/80 dark:border-gray-700/60 group-hover/proof:border-brand-400 dark:group-hover/proof:border-brand-500 transition-all duration-200 shadow-sm">
                                    <img src={settlement.proof} alt="Payment proof" className="w-full h-full object-cover" />
                                </div>
                                <span className="flex items-center gap-1">
                                    <Image className="w-3.5 h-3.5" />
                                    View Payment Proof
                                </span>
                            </button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Modal open={showConfirm} onClose={() => setShowConfirm(false)} title="Delete Settlement" size="sm">
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete this settlement of{' '}
                        <strong className="text-gray-900 dark:text-white">{formatCurrency(settlement.amount)}</strong>?
                        This action cannot be undone and balances will be recalculated.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => setShowConfirm(false)}>Cancel</Button>
                        <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {settlement.proof && (
                <Modal open={showProof} onClose={() => setShowProof(false)} title="Payment Proof" size="lg">
                    <div className="flex items-center justify-center">
                        <img src={settlement.proof} alt="Payment proof" className="max-w-full max-h-[70vh] rounded-xl object-contain" />
                    </div>
                </Modal>
            )}
        </>
    );
}
