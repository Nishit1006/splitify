import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, Search, ArrowRight } from 'lucide-react';
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import CreateGroupModal from "../../components/groups/CreateGroupModal";
import api from "../../lib/api";
import { toast } from 'sonner';

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchGroups = async () => {
        try {
            const { data } = await api.get('/groups/my');
            // FIXED: Added the extra .data here so it successfully finds the groups array!
            setGroups(data.data?.groups || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const filteredGroups = groups.filter(g =>
        g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Manage your shared expenses and settlements
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4" /> New Group
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search groups..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {loading ? (
                        <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-32 rounded-xl" />
                            ))}
                        </div>
                    ) : groups.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No groups yet"
                            description="Create your first group to start splitting expenses with friends."
                            className="py-16"
                            action={
                                <Button onClick={() => setIsCreateModalOpen(true)}>
                                    <Plus className="w-4 h-4" /> Create Group
                                </Button>
                            }
                        />
                    ) : filteredGroups.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No groups match your search "{searchQuery}"
                        </div>
                    ) : (
                        <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredGroups.map((group) => (
                                <Link key={group._id} to={`/groups/${group._id}`}>
                                    <Card hover className="h-full border-gray-200 dark:border-gray-700 hover:border-brand-500 dark:hover:border-brand-500 transition-colors">
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                        {group.name}
                                                    </h3>
                                                    {group.description && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                            {group.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400">
                                                    {group.groupImage ? (
                                                        <img src={group.groupImage} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <Users className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:underline">
                                                View Details <ArrowRight className="w-4 h-4 ml-1" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <CreateGroupModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchGroups}
            />
        </div>
    );
}
