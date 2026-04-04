import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Download, Calendar, CreditCard, StickyNote, CheckCircle } from 'lucide-react';
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
            <div className="space-y-5">
                <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/10 rounded-2xl border border-emerald-100/60 dark:border-emerald-800/30">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Amount Paid</p>
                    </div>
                    <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight">
                        {formatCurrency(settlement.amount)}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(settlement.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="capitalize">{settlement.paymentMethod}</span>
                    </div>
                    {settlement.referenceNote && (
                        <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400 p-3 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                            <StickyNote className="w-4 h-4 mt-0.5 text-gray-400" />
                            <span className="italic">"{settlement.referenceNote}"</span>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Proof of Payment</p>
                    {settlement.proof ? (
                        <div className="relative group rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-700/60 bg-gray-100 dark:bg-gray-800/40">
                            <img
                                src={settlement.proof}
                                alt="Proof"
                                className="w-full h-auto max-h-80 object-contain mx-auto"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                <Button size="sm" onClick={handleDownload}>
                                    <Download className="w-4 h-4" /> Download Proof
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center border-2 border-dashed border-gray-200/80 dark:border-gray-700/40 rounded-2xl text-gray-400 text-sm">
                            No image provided.
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}