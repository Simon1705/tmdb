import { Film, Award, TrendingUp } from 'lucide-react';
import { Analytics } from './lib/types';

interface SummaryCardsProps {
  analytics: Analytics | null;
  loading: boolean;
}

export const SummaryCards = ({ analytics, loading }: SummaryCardsProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-800/40 border border-white/15 rounded-xl shadow-xl p-6 hover:-translate-y-1 hover:border-white/25 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-100/80">Total Movies</p>
            {loading ? (
              <div className="h-9 w-16 bg-white/10 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-3xl font-bold text-white mt-1">{analytics?.summary?.totalMovies || 0}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-white/15 rounded-xl shadow-xl p-6 hover:-translate-y-1 hover:border-white/25 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-md">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-100/80">Most Popular Genre</p>
            {loading ? (
              <div className="h-8 w-24 bg-white/10 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-white mt-1 truncate">{analytics?.summary?.mostPopularGenre}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 border border-white/15 rounded-xl shadow-xl p-6 hover:-translate-y-1 hover:border-white/25 transition-all">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-100/80">Average Rating</p>
            {loading ? (
              <div className="h-9 w-16 bg-white/10 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-3xl font-bold text-white mt-1">
                {analytics?.summary?.averageRating ? Number(analytics.summary.averageRating).toFixed(1) : '0.0'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
