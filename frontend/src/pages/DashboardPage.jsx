import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
    Wallet, TrendingDown, TrendingUp, ArrowRight, Plus, Users,
    Receipt, Bell, AlertCircle, Sparkles
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ClayLoader from '../components/ui/ClayLoader';
import EmptyState from '../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../lib/utils';
import api from '../lib/api';
import gsap from 'gsap';

function AnimatedCounter({ value, prefix = '', className }) {
    const ref = useRef(null);
    const prevValue = useRef(0);

    useEffect(() => {
        if (ref.current) {
            const obj = { val: prevValue.current };
            gsap.to(obj, {
                val: value,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => {
                    if (ref.current) {
                        const abs = Math.abs(obj.val);
                        const formatted = abs.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        });
                        ref.current.textContent = `${obj.val < 0 ? '-' : ''}${prefix}${formatted}`;
                    }
                },
            });
            prevValue.current = value;
        }
    }, [value, prefix]);

    return <span ref={ref} className={className}>{prefix}0.00</span>;
}

export default function DashboardPage() {
    const [balance, setBalance] = useState({ totalOwed: 0, totalOwedToYou: 0 });
    const [notifications, setNotifications] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balanceError, setBalanceError] = useState(false);
    const cardsRef = useRef(null);

    const fetchDashboard = async () => {
        try {
            const [balRes, notifRes, groupRes] = await Promise.allSettled([
                api.get('/balances/user/net'),
                api.get('/notifications?limit=5'),
                api.get('/groups/my'),
            ]);

            if (balRes.status === 'fulfilled') {
                setBalance(balRes.value.data.data);
                setBalanceError(false);
            } else {
                setBalanceError(true);
            }

            if (notifRes.status === 'fulfilled') {
                setNotifications(notifRes.value.data.data || []);
            }

            if (groupRes.status === 'fulfilled') {
                setGroups(groupRes.value.data.data?.groups || []);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    useEffect(() => {
        if (!loading && cardsRef.current) {
            gsap.fromTo(
                cardsRef.current.children,
                { opacity: 0, y: 20, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power3.out',
                }
            );
        }
    }, [loading]);

    const handleAcceptInvite = async (inviteId) => {
        try {
            await api.post(`/invitations/accept/${inviteId}`);
            toast.success('Successfully joined the group!');
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to accept invite');
        }
    };

    const handleRejectInvite = async (inviteId) => {
        try {
            await api.post(`/invitations/reject/${inviteId}`);
            toast.success('Invitation rejected');
            fetchDashboard();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reject invite');
        }
    };

    const netDifference = balance.totalOwedToYou - balance.totalOwed;

    if (loading) {
        return <ClayLoader text="Loading your dashboard..." />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-heading text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        Dashboard
                        <Sparkles className="w-6 h-6 text-brand-500" />
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 font-medium">
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

            {balanceError ? (
                <Card>
                    <CardContent className="py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                        </div>
                        <h3 className="font-bold text-red-700 dark:text-red-400 text-lg">Failed to load balances</h3>
                        <p className="text-sm text-red-600/80 dark:text-red-300/80 mt-1">Please refresh the page to try again.</p>
                    </CardContent>
                </Card>
            ) : (
                <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Net Difference */}
                    <Card className="relative overflow-hidden group" hover>
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Net Balance</p>
                                    <p className={`text-3xl font-black mt-2 tracking-tight ${netDifference >= 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        <AnimatedCounter value={netDifference} prefix="₹" />
                                    </p>
                                </div>
                                <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-clayPressed ${netDifference >= 0
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                    : 'bg-red-100 dark:bg-red-900/30'
                                    }`}>
                                    <Wallet className={`w-7 h-7 ${netDifference >= 0
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-red-600 dark:text-red-400'
                                        }`} />
                                </div>
                            </div>
                        </CardContent>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-[28px] ${netDifference >= 0
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                            : 'bg-gradient-to-r from-red-400 to-rose-500'
                            }`} />
                    </Card>

                    {/* You Owe */}
                    <Card className="relative overflow-hidden group" hover>
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total You Owe</p>
                                    <p className="text-3xl font-black mt-2 text-red-600 dark:text-red-400 tracking-tight">
                                        <AnimatedCounter value={balance.totalOwed} prefix="₹" />
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-[20px] bg-red-100 dark:bg-red-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-clayPressed">
                                    <TrendingDown className="w-7 h-7 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[28px] bg-gradient-to-r from-red-400 to-rose-500" />
                    </Card>

                    {/* Owed to You */}
                    <Card className="relative overflow-hidden group" hover>
                        <CardContent className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Owed to You</p>
                                    <p className="text-3xl font-black mt-2 text-emerald-600 dark:text-emerald-400 tracking-tight">
                                        <AnimatedCounter value={balance.totalOwedToYou} prefix="₹" />
                                    </p>
                                </div>
                                <div className="w-14 h-14 rounded-[20px] bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-clayPressed">
                                    <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[28px] bg-gradient-to-r from-emerald-400 to-teal-500" />
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200/20 dark:border-gray-700/20 flex items-center justify-between">
                            <h3 className="font-black font-heading text-gray-900 dark:text-white flex items-center gap-2">
                                <Bell className="w-4 h-4 text-brand-500" /> Recent Activity
                            </h3>
                            <Link to="/activity" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-200/20 dark:divide-gray-700/20">
                            {notifications.length === 0 ? (
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
                                        className={`px-6 py-4 flex items-start gap-3 transition-colors duration-200 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 ${!notif.isRead ? 'bg-brand-50/20 dark:bg-brand-950/10' : ''
                                            }`}
                                    >
                                        <div
                                            className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${notif.isRead ? 'bg-gray-300 dark:bg-gray-600' : 'bg-brand-500 animate-pulse-glow'
                                                }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{notif.message}</p>

                                            {notif.type === 'group_invite' && !notif.isRead && (
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Button size="sm" onClick={() => handleAcceptInvite(notif.relatedId)}>Accept</Button>
                                                    <Button size="sm" variant="danger" onClick={() => handleRejectInvite(notif.relatedId)}>Reject</Button>
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{formatDate(notif.createdAt)}</p>
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

                {/* My Groups */}
                <div>
                    <Card>
                        <div className="px-6 py-4 border-b border-gray-200/20 dark:border-gray-700/20 flex items-center justify-between">
                            <h3 className="font-black font-heading text-gray-900 dark:text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-brand-500" /> My Groups
                            </h3>
                            <Link to="/groups" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 transition-colors">
                                View all <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-200/20 dark:divide-gray-700/20">
                            {groups.length === 0 ? (
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
                                        className="block px-6 py-3.5 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition-colors duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-[14px] gradient-brand flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200 shadow-sm">
                                                <Users className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{g.name}</p>
                                                {g.description && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{g.description}</p>
                                                )}
                                            </div>
                                        </div>
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
