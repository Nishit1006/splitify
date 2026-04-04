import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatCurrency } from '../../lib/utils';

export default function BalanceSummary({ balanceData, onSettleUp }) {
    if (!balanceData) return null;

    const { netBalance, youOwe = [], youGet = [] } = balanceData;

    return (
        <div className="space-y-4">
            <Card className="bg-brand-50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/20">
                <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${netBalance >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                }`}>
                                <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</p>
                                <p className={`text-xl font-bold ${netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {formatCurrency(netBalance)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">You Owe</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {youOwe.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">You don't owe anything.</div>
                        ) : (
                            youOwe.map((item, idx) => {
                                const user = item.user;
                                const name = user?.fullName || user?.username || 'Deleted User';
                                const isDeleted = !user;

                                return (
                                    <div key={user?._id || idx} className="p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar name={name} size="sm" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
                                                <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-0.5">
                                                    Owe {formatCurrency(item.amount)}
                                                </p>
                                            </div>
                                        </div>
                                        {!isDeleted && (
                                            <Button size="sm" onClick={() => onSettleUp(user)}>Settle</Button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>

                <Card>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">You are Owed</h3>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {youGet.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">Nobody owes you anything.</div>
                        ) : (
                            youGet.map((item, idx) => {
                                const user = item.user;
                                const name = user?.fullName || user?.username || 'Deleted User';

                                return (
                                    <div key={user?._id || idx} className="p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar name={name} size="sm" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                                                    Gets {formatCurrency(item.amount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
