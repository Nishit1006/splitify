import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Wallet,
    TrendingDown,
    TrendingUp,
    ArrowRight,
    Plus,
    Users,
    Receipt,
    Bell,
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../lib/utils';
import api from '../lib/api';

export default function DashboardPage() {
    const [balance, setBalance] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [balRes, notifRes, groupRes] = await Promise.allSettled([
                    api.get('/balances/user/net'),
                    api.get('/notifications?limit=5'),
                    api.get('/groups/my'),
                ]);

                if (balRes.status === 'fulfilled') setBalance(balRes.value.data.data);
                if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data.data || []);
                if (groupRes.status === 'fulfilled') setGroups(groupRes.value.data.groups || []);
            } catch {
                // individual failures handled by allSettled
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const netBalance = balance?.netBalance ?? 0;

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Your financial overview at a glance
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link to="/groups">
                        <Button variant="secondary" size="sm">
                            <Users className="w-4 h-4" /> Groups
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Summary Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total Balance */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</p>
                                    <p
                                        className={`text-2xl font-bold mt-1 ${netBalance >= 0
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-red-600 dark:text-red-400'
                                            }`}
                                    >
                                        {formatCurrency(netBalance)}
                                    </p>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${netBalance >= 0
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                            : 'bg-red-100 dark:bg-red-900/30'
                                        }`}
                                >
                                    <Wallet
                                        className={`w-6 h-6 ${netBalance >= 0
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-red-600 dark:text-red-400'
                                            }`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <div
                            className={`absolute bottom-0 left-0 right-0 h-1 ${netBalance >= 0
                                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                                    : 'bg-gradient-to-r from-red-400 to-red-500'
                                }`}
                        />
                    </Card>

                    {/* You Owe */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">You Owe</p>
                                    <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                                        {formatCurrency(netBalance < 0 ? Math.abs(netBalance) : 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-500" />
                    </Card>

                    {/* You Are Owed */}
                    <Card className="relative overflow-hidden">
                        <CardContent className="py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">You Are Owed</p>
                                    <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(netBalance > 0 ? netBalance : 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
                    </Card>
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Bell className="w-4 h-4 text-brand-500" /> Recent Activity
                            </h3>
                            <Link to="/activity" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                [1, 2, 3].map((i) => (
                                    <div key={i} className="px-6 py-4 flex gap-3">
                                        <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/3" />
                                        </div>
                                    </div>
                                ))
                            ) : notifications.length === 0 ? (
                                <EmptyState
                                    icon={Bell}
                                    title="No recent activity"
                                    description="Your notifications will appear here"
                                    className="py-10"
                                />
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif._id}
                                        className={`px-6 py-4 flex items-start gap-3 ${!notif.isRead ? 'bg-brand-50/50 dark:bg-brand-950/20' : ''
                                            }`}
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.isRead ? 'bg-gray-300 dark:bg-gray-600' : 'bg-brand-500'
                                                }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{notif.message}</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                {formatDate(notif.createdAt)}
                                            </p>
                                        </div>
                                        {notif.type && (
                                            <Badge
                                                color={
                                                    notif.type === 'expense_added'
                                                        ? 'blue'
                                                        : notif.type === 'settlement_received'
                                                            ? 'green'
                                                            : notif.type === 'group_invite'
                                                                ? 'brand'
                                                                : 'default'
                                                }
                                            >
                                                {notif.type.replace(/_/g, ' ')}
                                            </Badge>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* My Groups Quick View */}
                <div>
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-brand-500" /> My Groups
                            </h3>
                            <Link to="/groups" className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                [1, 2, 3].map((i) => (
                                    <div key={i} className="px-6 py-3">
                                        <Skeleton className="h-4 w-3/4 mb-1" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                ))
                            ) : groups.length === 0 ? (
                                <EmptyState
                                    icon={Users}
                                    title="No groups yet"
                                    description="Create your first group"
                                    className="py-8"
                                    action={
                                        <Link to="/groups">
                                            <Button size="sm">
                                                <Plus className="w-4 h-4" /> New Group
                                            </Button>
                                        </Link>
                                    }
                                />
                            ) : (
                                groups.slice(0, 5).map((g) => (
                                    <Link
                                        key={g._id}
                                        to={`/groups/${g._id}`}
                                        className="block px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{g.name}</p>
                                        {g.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                                {g.description}
                                            </p>
                                        )}
                                    </Link>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
