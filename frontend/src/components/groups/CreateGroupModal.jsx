import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

export default function CreateGroupModal({ open, onClose, onSuccess }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [groupImage, setGroupImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setName('');
            setDescription('');
            setGroupImage(null);
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Group name is required');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);

            if (groupImage) {
                formData.append('groupImage', groupImage);
            }

            const { data } = await api.post('/groups', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Group created successfully!');
            onSuccess?.();
            onClose();
            navigate(`/groups/${data.data.group._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Create New Group" size="sm">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Group Name"
                    placeholder="e.g., Goa Trip, Flatmates"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />

                <Input
                    label="Description (optional)"
                    placeholder="What is this group for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Image (optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setGroupImage(e.target.files[0])}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900/20 dark:file:text-brand-400"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        Create Group
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
