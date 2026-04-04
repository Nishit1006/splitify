import { useState } from 'react';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

export default function InviteMemberModal({ open, onClose, groupId }) {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!identifier.trim()) {
            toast.error('Email or username is required');
            return;
        }

        setLoading(true);
        try {
            await api.post('/invitations/send', {
                groupId,
                identifier: identifier.trim()
            });
            toast.success(`Invitation sent successfully!`);
            setIdentifier('');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send invitation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Invite Member">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email Address or Username"
                    type="text"
                    placeholder="e.g., johndoe or john@example.com"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    If they have an account, they will receive an in-app notification. Otherwise, they will get an email link to join!
                </p>
                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={loading}>
                        <UserPlus className="w-4 h-4" /> Send Invite
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
