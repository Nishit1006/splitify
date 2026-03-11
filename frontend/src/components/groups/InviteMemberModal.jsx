import { useState } from 'react';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../lib/api';

export default function InviteMemberModal({ open, onClose, groupId }) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username.trim()) {
            toast.error('Username is required');
            return;
        }
        setLoading(true);
        try {
            await api.post('/invitations/invite', { groupId, username: username.trim() });
            toast.success(`Invitation sent to @${username}`);
            setUsername('');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to invite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Invite Member">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username"
                    placeholder="Enter their username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    The user will receive an email invitation to join this group.
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
