import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function GroupCard({ group, onDeleted }) {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Only the group creator can delete
    const isCreator =
        group.createdBy === user?._id ||
        group.createdBy?._id === user?._id ||
        group.createdBy?.toString() === user?._id?.toString();

    const handleDeleteClick = (e) => {
        e.preventDefault();  // prevent Link navigation
        e.stopPropagation();
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/groups/${group._id}`);
            toast.success(`"${group.name}" deleted successfully`);
            setShowConfirm(false);
            onDeleted?.(group._id);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete group');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Link to={`/groups/${group._id}`}>
                <Card hover className="h-full">
                    <CardContent className="py-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
                                {group.name?.[0]?.toUpperCase() || 'G'}
                            </div>
                            <div className="flex items-center gap-1">
                                {/* Delete button — only for group creator */}
                                {isCreator && (
                                    <button
                                        onClick={handleDeleteClick}
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        title="Delete group"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5" />
                            </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {group.name}
                        </h3>
                        {group.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {group.description}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </Link>

            {/* Delete confirmation modal */}
            <Modal
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Delete Group"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete{' '}
                        <strong className="text-gray-900 dark:text-white">
                            "{group.name}"
                        </strong>
                        ? This will permanently delete all expenses, splits and
                        settlements in this group.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowConfirm(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete Group'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}