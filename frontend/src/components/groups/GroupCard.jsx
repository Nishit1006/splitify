import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, ArrowRight } from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { cn } from '../../lib/utils';

export default function GroupCard({ group }) {
    return (
        <Link to={`/groups/${group._id}`}>
            <Card hover className="h-full">
                <CardContent className="py-5">
                    <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
                            {group.name?.[0]?.toUpperCase() || 'G'}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 mt-1" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{group.name}</h3>
                    {group.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {group.description}
                        </p>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
