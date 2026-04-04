import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import api from '../../lib/api';

const splitOptions = [
    { value: 'EQUAL', label: 'Equal Split' },
    { value: 'EXACT', label: 'Exact Amounts' },
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'SHARES', label: 'Shares' },
];

export default function EditExpenseModal({ open, onClose, expense, members = [], onUpdated }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        totalAmount: '',
        splitType: 'EQUAL',
        paidBy: ''
    });
    const [receipt, setReceipt] = useState(null);
    const [splitInputs, setSplitInputs] = useState({});
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && expense) {
            setForm({
                title: expense.title || '',
                description: expense.description || '',
                totalAmount: expense.totalAmount || '',
                splitType: expense.splitType || 'EQUAL',
                paidBy: expense.paidBy?._id || expense.paidBy || ''
            });
            setReceipt(null);

            const fetchSplits = async () => {
                try {
                    const { data } = await api.get(`/expenses/${expense._id}`);
                    const splits = data.data.splits || [];
                    const memberIds = splits.map((s) => s.userId._id || s.userId);
                    setSelectedMembers(memberIds);

                    const inputs = {};
                    splits.forEach((s) => {
                        const id = s.userId._id || s.userId;
                        inputs[id] = s.splitValue;
                    });
                    setSplitInputs(inputs);
                } catch (err) {
                    toast.error('Failed to load expense splits');
                }
            };
            fetchSplits();
        }
    }, [open, expense]);

    const toggleMember = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const payerOptions = members.map(m => ({
        value: m.user?._id || m._id,
        label: m.user?.fullName || m.user?.username || m.fullName || m.username
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const total = Number(form.totalAmount);

        if (!form.title.trim() || !form.totalAmount || total <= 0) {
            toast.error('Title and a positive amount are required');
            return;
        }
        if (!form.paidBy) {
            toast.error('Please select who paid the expense');
            return;
        }
        if (selectedMembers.length === 0) {
            toast.error('Select at least one member');
            return;
        }

        if (form.splitType === 'EXACT') {
            const sum = selectedMembers.reduce((acc, id) => acc + Number(splitInputs[id] || 0), 0);
            if (Math.abs(sum - total) > 0.01) {
                toast.error(`Exact amounts must sum up to ${total}. Current total: ${sum}`);
                return;
            }
        }

        if (form.splitType === 'PERCENTAGE') {
            const sum = selectedMembers.reduce((acc, id) => acc + Number(splitInputs[id] || 0), 0);
            if (Math.abs(sum - 100) > 0.01) {
                toast.error(`Percentages must sum up to 100%. Current total: ${sum}%`);
                return;
            }
        }

        if (form.splitType === 'SHARES') {
            const sum = selectedMembers.reduce((acc, id) => acc + Number(splitInputs[id] || 0), 0);
            if (sum <= 0) {
                toast.error('Total shares must be greater than 0');
                return;
            }
        }

        let splits;
        if (form.splitType === 'EQUAL') {
            splits = selectedMembers;
        } else if (form.splitType === 'EXACT') {
            splits = selectedMembers.map((id) => ({
                userId: id,
                amount: Number(splitInputs[id] || 0),
            }));
        } else if (form.splitType === 'PERCENTAGE') {
            splits = selectedMembers.map((id) => ({
                userId: id,
                percentage: Number(splitInputs[id] || 0),
            }));
        } else if (form.splitType === 'SHARES') {
            splits = selectedMembers.map((id) => ({
                userId: id,
                shares: Number(splitInputs[id] || 1),
            }));
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('totalAmount', total);
            formData.append('splitType', form.splitType);
            formData.append('paidBy', form.paidBy);

            formData.append('splits', JSON.stringify(splits));

            if (receipt) {
                formData.append('receipt', receipt);
            }

            await api.put(`/expenses/${expense._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Expense updated!');
            onUpdated?.();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Edit Expense" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    placeholder="e.g., Dinner at Pizza Hut"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <Input
                    label="Amount"
                    type="number"
                    placeholder="0.00"
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    min="0"
                    step="0.01"
                />

                <Select
                    label="Paid By"
                    value={form.paidBy}
                    onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
                    options={payerOptions}
                />

                <Input
                    label="Description (optional)"
                    placeholder="Add notes..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Receipt Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReceipt(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/20 dark:file:text-brand-400"
                    />
                </div>

                <Select
                    label="Split Type"
                    value={form.splitType}
                    onChange={(e) => setForm({ ...form, splitType: e.target.value })}
                    options={splitOptions}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Split between
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {members.map((member) => {
                            const id = member.user?._id || member._id;
                            const name = member.user?.fullName || member.user?.username || member.fullName || member.username;
                            const isSelected = selectedMembers.includes(id);

                            return (
                                <div key={id} className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 flex-1 cursor-pointer min-w-0">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleMember(id)}
                                            className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                                        />
                                        <Avatar name={name} size="sm" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{name}</span>
                                    </label>

                                    {form.splitType !== 'EQUAL' && isSelected && (
                                        <input
                                            type="number"
                                            placeholder={
                                                form.splitType === 'PERCENTAGE'
                                                    ? '%'
                                                    : form.splitType === 'SHARES'
                                                        ? 'Shares'
                                                        : '₹'
                                            }
                                            value={splitInputs[id] || ''}
                                            onChange={(e) =>
                                                setSplitInputs({ ...splitInputs, [id]: e.target.value })
                                            }
                                            className="w-24 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                                            min="0"
                                            step="any"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
}