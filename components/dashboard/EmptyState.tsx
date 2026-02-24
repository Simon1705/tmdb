import Link from 'next/link';
import { BarChart3, Database } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="bg-slate-800/40 rounded-2xl shadow-xl p-12 text-center border border-white/15">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-10 h-10 text-indigo-200" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
        <p className="text-indigo-100/80 mb-6">
          No movies found in the selected date range. Try adjusting your filters or sync data first.
        </p>
        <Link
          href="/data-management"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors font-medium shadow-lg shadow-indigo-500/30"
        >
          <Database className="w-4 h-4" />
          Go to Data Management
        </Link>
      </div>
    </div>
  );
};
