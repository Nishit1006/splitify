// import { Receipt, Calendar, User } from 'lucide-react';
// import Card, { CardContent } from '../../components/ui/Card';
// import Badge from '../../components/ui/Badge';
// import { formatCurrency, formatDate, SPLIT_TYPE_LABELS } from '../../lib/utils';

// export default function ExpenseCard({ expense, onClick }) {
//     return (
//         <Card hover className="cursor-pointer" onClick={onClick}>
//             <CardContent className="py-4">
//                 <div className="flex items-start justify-between gap-3">
//                     <div className="flex items-start gap-3 min-w-0">
//                         <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
//                             <Receipt className="w-5 h-5 text-brand-600 dark:text-brand-400" />
//                         </div>
//                         <div className="min-w-0">
//                             <h4 className="font-medium text-gray-900 dark:text-white truncate">
//                                 {expense.title}
//                             </h4>
//                             <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
//                                 <span className="flex items-center gap-1">
//                                     <User className="w-3 h-3" />
//                                     {expense.paidBy?.username || 'Unknown'}
//                                 </span>
//                                 <span>•</span>
//                                 <span className="flex items-center gap-1">
//                                     <Calendar className="w-3 h-3" />
//                                     {formatDate(expense.expenseDate)}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                         <p className="font-semibold text-gray-900 dark:text-white">
//                             {formatCurrency(expense.totalAmount)}
//                         </p>
//                         <Badge color="brand" className="mt-1">
//                             {SPLIT_TYPE_LABELS[expense.splitType] || expense.splitType}
//                         </Badge>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// }

import { useState } from 'react';
import { Receipt, Calendar, User, Trash2 } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { formatCurrency, formatDate, SPLIT_TYPE_LABELS } from '../../lib/utils';

export default function ExpenseCard({ expense, onClick, currentUserId, onDeleted }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Only the person who paid (created) the expense can delete it
    const isOwner =
        expense.paidBy?._id === currentUserId ||
        expense.paidBy?._id?.toString() === currentUserId?.toString();

    const handleDeleteClick = (e) => {
        e.stopPropagation(); // prevent triggering onClick of card
        setShowConfirm(true);
    };

    const handleConfirmDelete = async (e) => {
        e.stopPropagation();
        setDeleting(true);
        try {
            await onDeleted(expense._id);
            setShowConfirm(false);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
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

                        <div className="flex items-start gap-2 flex-shrink-0">
                            <div className="text-right">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(expense.totalAmount)}
                                </p>
                                <Badge color="brand" className="mt-1">
                                    {SPLIT_TYPE_LABELS[expense.splitType] || expense.splitType}
                                </Badge>
                            </div>

                            {/* Delete button — only visible to expense creator */}
                            {isOwner && (
                                <button
                                    onClick={handleDeleteClick}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-0.5"
                                    title="Delete expense"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete confirmation modal */}
            <Modal
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                title="Delete Expense"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Are you sure you want to delete{' '}
                        <strong className="text-gray-900 dark:text-white">
                            "{expense.title}"
                        </strong>
                        ? This will also remove all split records and update balances.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowConfirm(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
