import { Receipt, Calendar, User } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate, SPLIT_TYPE_LABELS } from '../../lib/utils';

export default function ExpenseCard({ expense, onClick }) {
    return (
        <Card hover className="cursor-pointer" onClick={onClick}>
            <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                            <Receipt className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                {expense.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {expense.paidBy?.username || 'Unknown'}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(expense.expenseDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(expense.totalAmount)}
                        </p>
                        <Badge color="brand" className="mt-1">
                            {SPLIT_TYPE_LABELS[expense.splitType] || expense.splitType}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
