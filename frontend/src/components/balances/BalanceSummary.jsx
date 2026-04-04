import { useEffect, useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { formatCurrency } from '../../lib/utils';
import gsap from 'gsap';

export default function BalanceSummary({ balanceData, onSettleUp }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current.children,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }
            );
        }
    }, [balanceData]);

    if (!balanceData) return null;

    const { netBalance, youOwe = [], youGet = [] } = balanceData;

    return (
        <div ref={containerRef} className="space-y-4">
            <Card className="bg-gradient-to-r from-brand-50/80 to-violet-50/50 dark:from-brand-900/10 dark:to-violet-900/10 border-brand-100/60 dark:border-brand-900/20">
                <CardContent className="py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110 ${netBalance >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                }`}>
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Balance</p>
                                <p className={`text-2xl font-bold tracking-tight ${netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {formatCurrency(netBalance)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <div className="px-4 py-3 border-b border-gray-100/80 dark:border-gray-800/60 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">You Owe</h3>
                    </div>
                    <div className="divide-y divide-gray-100/80 dark:divide-gray-800/60">
                        {youOwe.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">You don't owe anything. 🎉</div>
                        ) : (
                            youOwe.map((item, idx) => {
                                const user = item.user;
                                const name = user?.fullName || user?.username || 'Deleted User';
                                const isDeleted = !user;

                                return (
                                    <div key={user?._id || idx} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar name={name} size="sm" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
                                                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">
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
                    <div className="px-4 py-3 border-b border-gray-100/80 dark:border-gray-800/60 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">You are Owed</h3>
                    </div>
                    <div className="divide-y divide-gray-100/80 dark:divide-gray-800/60">
                        {youGet.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">Nobody owes you anything.</div>
                        ) : (
                            youGet.map((item, idx) => {
                                const user = item.user;
                                const name = user?.fullName || user?.username || 'Deleted User';

                                return (
                                    <div key={user?._id || idx} className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <Avatar name={name} size="sm" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{name}</p>
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
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
