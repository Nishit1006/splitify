import { useState, useEffect, useRef } from 'react';
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
import gsap from 'gsap';

export default function GroupsPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const gridRef = useRef(null);

    const fetchGroups = async () => {
        try {
            const { data } = await api.get('/groups/my');
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

    useEffect(() => {
        if (!loading && gridRef.current && gridRef.current.children.length > 0) {
            gsap.fromTo(
                gridRef.current.children,
                { opacity: 0, y: 20, scale: 0.96 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'power3.out' }
            );
        }
    }, [loading, searchQuery]);

    const filteredGroups = groups.filter(g =>
        g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Groups <Users className="w-6 h-6 text-brand-500" />
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">
                        Manage your shared expenses and settlements
                    </p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4" /> New Group
                </Button>
            </div>

            <Card>
                <div className="p-4 border-b border-gray-100/80 dark:border-gray-800/60">
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

                <div className="divide-y divide-gray-100/80 dark:divide-gray-800/60">
                    {loading ? (
                        <div className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-36 rounded-xl" />
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
                        <div ref={gridRef} className="p-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredGroups.map((group) => (
                                <Link key={group._id} to={`/groups/${group._id}`}>
                                    <Card hover className="h-full group border-gray-200/80 dark:border-gray-800/60 hover:border-brand-400 dark:hover:border-brand-500 transition-all duration-300">
                                        <CardContent className="p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                                        {group.name}
                                                    </h3>
                                                    {group.description && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                            {group.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-900/30 dark:to-violet-900/30 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300">
                                                    {group.groupImage ? (
                                                        <img src={group.groupImage} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <Users className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </div>

                                            <div className="mt-6 flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform duration-200">
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
