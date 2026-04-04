import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Handshake } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import api from '../../lib/api';

const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI / Bank Transfer' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'other', label: 'Other' },
];

export default function SettleUpModal({ open, onClose, groupId, targetUser, onSettled }) {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [referenceNote, setReferenceNote] = useState('');
    const [proof, setProof] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setAmount('');
            setPaymentMethod('cash');
            setReferenceNote('');
            setProof(null);
        }
    }, [open]);

    const targetName = targetUser?.fullName || targetUser?.username || 'Deleted User';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!targetUser || !targetUser._id) {
            toast.error('Cannot settle with a deleted user.');
            return;
        }

        const numAmount = Number(amount);
        if (!amount || numAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('groupId', groupId);
            formData.append('paidTo', targetUser._id);
            formData.append('amount', numAmount);
            formData.append('paymentMethod', paymentMethod);
            formData.append('referenceNote', referenceNote);

            if (proof) {
                formData.append('proof', proof);
            }

            await api.post('/settlements', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Settlement recorded successfully');
            onSettled?.();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to record settlement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Settle Up" size="sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-center gap-4 py-2">
                    <div className="flex flex-col items-center gap-2">
                        <Avatar name="You" size="md" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">You</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center text-brand-500">
                        <Handshake className="w-6 h-6" />
                        <div className="w-full border-t border-dashed border-brand-300 dark:border-brand-700 mt-2" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Avatar name={targetName} size="md" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                            {targetName.split(' ')[0]}
                        </span>
                    </div>
                </div>

                <Input
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    autoFocus
                />

                <Select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    options={paymentMethods}
                />

                <Input
                    label="Reference Note (optional)"
                    placeholder="e.g., Paid via Google Pay"
                    value={referenceNote}
                    onChange={(e) => setReferenceNote(e.target.value)}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Proof Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProof(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/20 dark:file:text-brand-400"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading} disabled={!targetUser?._id}>
                        Record Payment
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
