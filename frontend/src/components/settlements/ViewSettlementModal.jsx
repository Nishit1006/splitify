import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Download, Calendar, CreditCard, StickyNote } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function ViewSettlementModal({ open, onClose, settlement }) {
    if (!settlement) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = settlement.proof;
        link.download = `payment-proof-${settlement._id}.png`;
        link.click();
    };

    return (
        <Modal open={open} onClose={onClose} title="Payment Details" size="md">
            <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Amount Paid</p>
                    <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(settlement.amount)}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(settlement.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <CreditCard className="w-4 h-4" />
                        <span className="capitalize">{settlement.paymentMethod}</span>
                    </div>
                    {settlement.referenceNote && (
                        <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                            <StickyNote className="w-4 h-4 mt-0.5" />
                            <span className="italic">"{settlement.referenceNote}"</span>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Proof of Payment</p>
                    {settlement.proof ? (
                        <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100">
                            <img
                                src={settlement.proof}
                                alt="Proof"
                                className="w-full h-auto max-h-80 object-contain mx-auto"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button size="sm" onClick={handleDownload}>
                                    <Download className="w-4 h-4" /> Download Proof
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-gray-400">
                            No image provided.
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}