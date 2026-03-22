
import { useState, useEffect } from 'react';
import { Plus, Users } from 'lucide-react';
import Button from '../../components/ui/Button';
import GroupCard from '../../components/groups/GroupCard';
import CreateGroupModal from '../../components/groups/CreateGroupModal';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonCard } from '../../components/ui/Skeleton';
import api from '../../lib/api';

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const fetchGroups = async () => {
        try {
            const { data } = await api.get('/groups/my');
            setGroups(data.groups || []);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCreated = (newGroup) => {
        setGroups((prev) => [newGroup, ...prev]);
    };

    // Remove deleted group from local state — no refetch needed
    const handleDeleted = (deletedGroupId) => {
        setGroups((prev) => prev.filter((g) => g._id !== deletedGroupId));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Manage your expense groups
                    </p>
                </div>
                <Button onClick={() => setShowCreate(true)}>
                    <Plus className="w-4 h-4" /> New Group
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : groups.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No groups yet"
                    description="Create your first group to start splitting expenses."
                    action={
                        <Button onClick={() => setShowCreate(true)}>
                            <Plus className="w-4 h-4" /> Create Group
                        </Button>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((g) => (
                        <GroupCard
                            key={g._id}
                            group={g}
                            onDeleted={handleDeleted}
                        />
                    ))}
                </div>
            )}

            <CreateGroupModal
                open={showCreate}
                onClose={() => setShowCreate(false)}
                onCreated={handleCreated}
            />
        </div>
    );
}
