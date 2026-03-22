

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, UserPlus, Receipt, Wallet, Users, Handshake, LogOut,
} from 'lucide-react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import ExpenseCard from '../../components/expenses/ExpenseCard';
import AddExpenseModal from '../../components/expenses/AddExpenseModal';
import BalanceSummary from '../../components/balances/BalanceSummary';
import SettleUpModal from '../../components/settlements/SettleUpModal';
import SettlementCard from '../../components/settlements/SettlementCard';
import InviteMemberModal from '../../components/groups/InviteMemberModal';
import Modal from '../../components/ui/Modal';
import { cn } from '../../lib/utils';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const TABS = [
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'balances', label: 'Balances', icon: Wallet },
    { id: 'settlements', label: 'Settlements', icon: Handshake },
    { id: 'members', label: 'Members', icon: Users },
];

export default function GroupDetailPage() {
    const { groupId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('expenses');
    const [loading, setLoading] = useState(true);

    // Data
    const [expenses, setExpenses] = useState([]);
    const [members, setMembers] = useState([]);
    const [balanceData, setBalanceData] = useState(null);
    const [settlements, setSettlements] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [groupData, setGroupData] = useState(null);

    // Modals
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [showInvite, setShowInvite] = useState(false);
    const [settleTarget, setSettleTarget] = useState(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [removing, setRemoving] = useState(false);

    // Leave group
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaving, setLeaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [expRes, balRes, setRes, memRes] = await Promise.allSettled([
                api.get(`/expenses/group/${groupId}`),
                api.get(`/balances/group/${groupId}`),
                api.get(`/settlements/group/${groupId}`),
                api.get(`/group-members/${groupId}`),
            ]);

            if (expRes.status === 'fulfilled') {
                setExpenses(expRes.value.data.data?.expenses || []);
            }
            if (balRes.status === 'fulfilled') {
                setBalanceData(balRes.value.data.data);
            }
            if (setRes.status === 'fulfilled') {
                setSettlements(setRes.value.data.data?.settlements || []);
            }
            if (memRes.status === 'fulfilled') {
                const data = memRes.value.data.data;
                setMembers(data?.members || []);
                if (data?.group?.name) setGroupName(data.group.name);
                if (data?.group) setGroupData(data.group);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

    // Derived — is current user the group creator/admin
    const currentMember = members.find((m) => m.user?._id === user?._id);
    const isAdmin = currentMember?.role === 'ADMIN';
    const isCreator =
        groupData?.createdBy?.toString() === user?._id?.toString() ||
        groupData?.createdBy === user?._id;

    const openRemoveModal = (member) => {
        setSelectedMember(member);
        setShowRemoveModal(true);
    };

    const handleRemoveMember = async () => {
        if (!selectedMember) return;
        setRemoving(true);
        try {
            await api.delete(`/group-members/${groupId}/${selectedMember.user._id}`);
            toast.success('Member removed successfully');
            setShowRemoveModal(false);
            setSelectedMember(null);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove member');
        } finally {
            setRemoving(false);
        }
    };

    const handleExpenseAdded = () => {
        fetchData();
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            await api.delete(`/expenses/${expenseId}`);
            setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
            const balRes = await api.get(`/balances/group/${groupId}`);
            setBalanceData(balRes.data.data);
            toast.success('Expense deleted successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete expense');
            throw err;
        }
    };

    // ── Leave Group ──
    const handleLeaveGroup = async () => {
        setLeaving(true);
        try {
            const res = await api.post(`/group-members/${groupId}/leave`);
            const { groupDeleted } = res.data.data || {};

            if (groupDeleted) {
                toast.success('Group deleted as you were the last member');
            } else if (isCreator) {
                toast.success('You left the group. Admin role transferred to another member');
            } else {
                toast.success('You have left the group');
            }

            // Either way navigate back to groups list
            navigate('/groups');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to leave group');
        } finally {
            setLeaving(false);
            setShowLeaveModal(false);
        }
    };

    // Dynamic leave modal message based on role and member count
    const getLeaveMessage = () => {
        const otherMembersCount = members.filter((m) => m.user?._id !== user?._id).length;

        if (isCreator && otherMembersCount === 0) {
            return (
                <>
                    You are the <strong>only member</strong> of this group. Leaving will{' '}
                    <strong className="text-red-500">permanently delete</strong> the group and all
                    its expenses, splits and settlements.
                </>
            );
        }
        if (isCreator) {
            return (
                <>
                    You are the <strong>group creator</strong>. Leaving will transfer admin
                    ownership to the next member. All group data will be preserved.
                </>
            );
        }
        return (
            <>
                Are you sure you want to leave <strong>{groupName}</strong>? You will lose
                access to all group expenses and balances.
            </>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/groups"
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {groupName || 'Group'}
                        </h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Leave Group button — always visible to all members */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowLeaveModal(true)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Leave</span>
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setShowInvite(true)}>
                        <UserPlus className="w-4 h-4" /> Invite
                    </Button>
                    <Button size="sm" onClick={() => setShowAddExpense(true)}>
                        <Plus className="w-4 h-4" /> Add Expense
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap flex-1',
                            'transition-all duration-200',
                            activeTab === tab.id
                                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 rounded-2xl" />
                    ))}
                </div>
            ) : (
                <>
                    {/* Expenses Tab */}
                    {activeTab === 'expenses' && (
                        <div className="space-y-3">
                            {expenses.length === 0 ? (
                                <EmptyState
                                    icon={Receipt}
                                    title="No expenses yet"
                                    description="Add your first expense to start tracking"
                                    action={
                                        <Button onClick={() => setShowAddExpense(true)}>
                                            <Plus className="w-4 h-4" /> Add Expense
                                        </Button>
                                    }
                                />
                            ) : (
                                expenses.map((exp) => (
                                    <ExpenseCard
                                        key={exp._id}
                                        expense={exp}
                                        currentUserId={user?._id}
                                        onDeleted={handleDeleteExpense}
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {/* Balances Tab */}
                    {activeTab === 'balances' && (
                        <BalanceSummary
                            balanceData={balanceData}
                            onSettleUp={(user) => setSettleTarget(user)}
                        />
                    )}

                    {/* Settlements Tab */}
                    {activeTab === 'settlements' && (
                        <div className="space-y-3">
                            {settlements.length === 0 ? (
                                <EmptyState
                                    icon={Handshake}
                                    title="No settlements yet"
                                    description="Settle up with group members from the Balances tab"
                                />
                            ) : (
                                settlements.map((s) => (
                                    <SettlementCard key={s._id} settlement={s} />
                                ))
                            )}
                        </div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <Card>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {members.length === 0 ? (
                                    <EmptyState
                                        icon={Users}
                                        title="No other members"
                                        description="Invite people to join this group"
                                        className="py-8"
                                        action={
                                            <Button size="sm" onClick={() => setShowInvite(true)}>
                                                <UserPlus className="w-4 h-4" /> Invite
                                            </Button>
                                        }
                                    />
                                ) : (
                                    members.map((m) => (
                                        <div
                                            key={m.user?._id}
                                            className="px-6 py-3 flex items-center gap-3 justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar name={m.user?.fullName || m.user?.username} />
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {m.user?.fullName}
                                                        </p>
                                                        {/* Role badge */}
                                                        {m.role === 'ADMIN' && (
                                                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-medium">
                                                                Admin
                                                            </span>
                                                        )}
                                                        {/* You badge */}
                                                        {m.user?._id === user?._id && (
                                                            <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 font-medium">
                                                                You
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        @{m.user?.username}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* Remove button — admin only, not on self */}
                                                {isAdmin &&
                                                    m.user?._id !== user?._id &&
                                                    m.role !== 'ADMIN' && (
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => openRemoveModal(m)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    )}
                </>
            )}

            {/* ── Modals ── */}
            <AddExpenseModal
                open={showAddExpense}
                onClose={() => setShowAddExpense(false)}
                groupId={groupId}
                members={members}
                onAdded={handleExpenseAdded}
            />

            <InviteMemberModal
                open={showInvite}
                onClose={() => setShowInvite(false)}
                groupId={groupId}
            />

            {settleTarget && (
                <SettleUpModal
                    open={!!settleTarget}
                    onClose={() => setSettleTarget(null)}
                    groupId={groupId}
                    targetUser={settleTarget}
                    onSettled={fetchData}
                />
            )}

            {/* Remove member modal */}
            <Modal
                open={showRemoveModal}
                onClose={() => setShowRemoveModal(false)}
                title="Remove Member"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-black dark:text-white">
                        Are you sure you want to remove{' '}
                        <strong>
                            {selectedMember?.user?.fullName || selectedMember?.user?.username}
                        </strong>{' '}
                        from this group?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowRemoveModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleRemoveMember}
                            disabled={removing}
                        >
                            {removing ? 'Removing...' : 'Remove'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Leave Group modal */}
            <Modal
                open={showLeaveModal}
                onClose={() => setShowLeaveModal(false)}
                title={isCreator && members.filter((m) => m.user?._id !== user?._id).length === 0
                    ? 'Delete Group'
                    : 'Leave Group'
                }
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        {getLeaveMessage()}
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowLeaveModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleLeaveGroup}
                            disabled={leaving}
                        >
                            {leaving
                                ? 'Processing...'
                                : isCreator && members.filter((m) => m.user?._id !== user?._id).length === 0
                                    ? 'Delete Group'
                                    : 'Leave Group'
                            }
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}