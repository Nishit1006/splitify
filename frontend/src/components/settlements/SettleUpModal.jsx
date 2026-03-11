import { useState } from 'react';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { formatCurrency, PAYMENT_METHOD_LABELS } from '../../lib/utils';
import api from '../../lib/api';

const paymentOptions = Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
    value,
    label,
}));

export default function SettleUpModal({ open, onClose, groupId, targetUser, onSettled }) {
    const [form, setForm] = useState({
        amount: '',
        paymentMethod: 'upi',
        referenceNote: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.amount || Number(form.amount) <= 0) {
            toast.error('Enter a valid amount');
            return;
        }
        setLoading(true);
        try {
            await api.post('/settlements', {
                groupId,
                paidTo: targetUser?._id,
                amount: Number(form.amount),
                paymentMethod: form.paymentMethod,
                referenceNote: form.referenceNote,
            });
            toast.success('Settlement recorded!');
            onSettled?.();
            setForm({ amount: '', paymentMethod: 'upi', referenceNote: '' });
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Settlement failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Settle Up">
            <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center gap-3">
                <Avatar name={targetUser?.fullName || targetUser?.username} size="md" />
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {targetUser?.fullName || targetUser?.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{targetUser?.username}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    min="0"
                    step="0.01"
                    autoFocus
                />

                <Select
                    label="Payment Method"
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    options={paymentOptions}
                />

                <Input
                    label="Reference Note (optional)"
                    placeholder="e.g., Paid via GPay"
                    value={form.referenceNote}
                    onChange={(e) => setForm({ ...form, referenceNote: e.target.value })}
                />

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        <Send className="w-4 h-4" /> Record Payment
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
