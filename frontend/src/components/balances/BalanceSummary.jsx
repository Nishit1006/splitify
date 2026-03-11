import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/utils';

export default function BalanceSummary({ balanceData, onSettleUp }) {
    if (!balanceData) return null;

    const { netBalance, youOwe = [], youGet = [] } = balanceData;

    return (
        <div className="space-y-4">
            {/* Net balance Card */}
            <Card>
                <CardContent className="py-5">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Your Net Balance</p>
                        <p
                            className={`text-3xl font-bold ${netBalance >= 0
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                        >
                            {formatCurrency(netBalance)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {netBalance > 0
                                ? 'You are owed money'
                                : netBalance < 0
                                    ? 'You owe money'
                                    : 'All settled up!'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* You Owe */}
            {youOwe.length > 0 && (
                <Card>
                    <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" /> You Owe
                        </h4>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {youOwe.map((item, i) => (
                            <div key={i} className="px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar name={item.user?.fullName || item.user?.username} size="sm" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {item.user?.fullName || item.user?.username}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        {formatCurrency(item.amount)}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onSettleUp?.(item.user)}
                                    >
                                        Settle
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* You Are Owed */}
            {youGet.length > 0 && (
                <Card>
                    <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> You Are Owed
                        </h4>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {youGet.map((item, i) => (
                            <div key={i} className="px-6 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar name={item.user?.fullName || item.user?.username} size="sm" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {item.user?.fullName || item.user?.username}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {youOwe.length === 0 && youGet.length === 0 && (
                <EmptyState
                    icon={TrendingUp}
                    title="All settled up!"
                    description="No outstanding balances in this group"
                    className="py-8"
                />
            )}
        </div>
    );
}
