import { ArrowRight } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { formatCurrency, formatDate, PAYMENT_METHOD_LABELS } from '../../lib/utils';

export default function SettlementCard({ settlement }) {
    return (
        <Card>
            <CardContent className="py-4">
                <div className="flex items-center gap-3">
                    <Avatar name={settlement.paidFrom?.fullName || settlement.paidFrom?.username} size="sm" />
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {settlement.paidFrom?.fullName || settlement.paidFrom?.username}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                            {settlement.paidTo?.fullName || settlement.paidTo?.username}
                        </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(settlement.amount)}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge color="green">
                                {PAYMENT_METHOD_LABELS[settlement.paymentMethod] || settlement.paymentMethod}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>{formatDate(settlement.settledAt)}</span>
                    {settlement.referenceNote && (
                        <>
                            <span>•</span>
                            <span className="truncate">{settlement.referenceNote}</span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
