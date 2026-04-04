import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { formatDate } from '../lib/utils';
import { toast } from 'sonner';
import api from '../lib/api';
import ViewSettlementModal from '../components/settlements/ViewSettlementModal';

export default function ActivityPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSettle, setSelectedSettle] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const handleViewSettlement = async (notif) => {
        if (!notif.isRead) markOneRead(notif._id);

        try {
            const { data } = await api.get(`/settlements/${notif.relatedId}`);
            setSelectedSettle(data.data);
            setIsViewOpen(true);
        } catch (err) {
            toast.error("Could not load settlement details. It may have been deleted.");
        }
    };

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications?limit=50');
            setNotifications(data.data || []);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            toast.success('All marked as read');
        } catch {
            toast.error('Failed to mark as read');
        }
    };

    const markOneRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
        } catch {
            // ignore
        }
    };

    const handleAcceptInvite = async (inviteId, notifId) => {
        try {
            await api.post(`/invitations/accept/${inviteId}`);
            toast.success('Successfully joined the group!');
            markOneRead(notifId);
            fetchNotifications();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept invite');
        }
    };

    const handleRejectInvite = async (inviteId, notifId) => {
        try {
            await api.post(`/invitations/reject/${inviteId}`);
            toast.success('Invitation rejected');
            markOneRead(notifId);
            fetchNotifications();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reject invite');
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const getTypeColor = (type) => {
        switch (type) {
            case 'expense_added': return 'blue';
            case 'expense_updated': return 'yellow';
            case 'settlement_received': return 'green';
            case 'group_invite': return 'brand';
            case 'member_added': return 'brand';
            default: return 'default';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="secondary" size="sm" onClick={markAllRead}>
                        <CheckCheck className="w-4 h-4" /> Mark all read
                    </Button>
                )}
            </div>

            <Card>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {loading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="px-6 py-4 flex gap-3">
                                <Skeleton className="w-2 h-2 rounded-full mt-2" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/4" />
                                </div>
                            </div>
                        ))
                    ) : notifications.length === 0 ? (
                        <EmptyState
                            icon={Bell}
                            title="No notifications"
                            description="You're all caught up!"
                            className="py-16"
                        />
                    ) : (
                        notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => !notif.isRead && markOneRead(notif._id)}
                                className={`px-6 py-4 flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!notif.isRead ? 'bg-brand-50/50 dark:bg-brand-950/20' : ''
                                    }`}
                            >
                                <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.isRead ? 'bg-gray-300 dark:bg-gray-600' : 'bg-brand-500'
                                        }`}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>

                                    {/* Action Buttons for Invites */}
                                    {notif.type === 'group_invite' && !notif.isRead && (
                                        <div className="flex items-center gap-2 mt-3">
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAcceptInvite(notif.relatedId, notif._id);
                                                }}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRejectInvite(notif.relatedId, notif._id);
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                        {formatDate(notif.createdAt)}
                                    </p>
                                </div>
                                {notif.type && (
                                    <Badge color={getTypeColor(notif.type)} className="flex-shrink-0">
                                        {notif.type.replace(/_/g, ' ')}
                                    </Badge>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </Card>
            <ViewSettlementModal
                open={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                settlement={selectedSettle}
            />
        </div>
    );
}
