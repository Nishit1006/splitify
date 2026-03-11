import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

export default function CreateGroupModal({ open, onClose, onCreated }) {
    const [form, setForm] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error('Group name is required');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/groups', form);
            toast.success('Group created!');
            onCreated?.(data.group);
            setForm({ name: '', description: '' });
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Create Group">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Group Name"
                    placeholder="e.g., Trip to Goa"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoFocus
                />
                <Input
                    label="Description (optional)"
                    placeholder="What's this group for?"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        <Plus className="w-4 h-4" /> Create Group
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
