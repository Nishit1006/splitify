import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Receipt, DollarSign } from 'lucide-react';
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

export default function AddExpenseModal({ open, onClose, groupId, members = [], onAdded }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        totalAmount: '',
        splitType: 'EQUAL',
    });
    const [splitInputs, setSplitInputs] = useState({});
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Select all members by default
    useEffect(() => {
        if (members.length > 0) {
            const memberIds = members.map((m) => m.user?._id || m._id);
            setSelectedMembers(memberIds);
            const inputs = {};
            memberIds.forEach((id) => {
                inputs[id] = '';
            });
            setSplitInputs(inputs);
        }
    }, [members]);

    const toggleMember = (id) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.totalAmount || Number(form.totalAmount) <= 0) {
            toast.error('Title and a positive amount are required');
            return;
        }
        if (selectedMembers.length === 0) {
            toast.error('Select at least one member');
            return;
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
            const { data } = await api.post('/expenses', {
                groupId,
                title: form.title,
                description: form.description,
                totalAmount: Number(form.totalAmount),
                splitType: form.splitType,
                splits,
            });
            toast.success('Expense added!');
            onAdded?.(data.data?.expense);
            setForm({ title: '', description: '', totalAmount: '', splitType: 'EQUAL' });
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    const getMemberName = (id) => {
        const member = members.find((m) => (m.user?._id || m._id) === id);
        return member?.user?.fullName || member?.user?.username || member?.fullName || member?.username || id;
    };

    return (
        <Modal open={open} onClose={onClose} title="Add Expense" size="md">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Title"
                    placeholder="e.g., Dinner at Pizza Hut"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    autoFocus
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

                <Input
                    label="Description (optional)"
                    placeholder="Add notes..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <Select
                    label="Split Type"
                    value={form.splitType}
                    onChange={(e) => setForm({ ...form, splitType: e.target.value })}
                    options={splitOptions}
                />

                {/* Member selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Split between
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
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

                                    {/* Custom split input */}
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
                        <Plus className="w-4 h-4" /> Add Expense
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
