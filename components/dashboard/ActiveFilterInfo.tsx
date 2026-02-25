import { format } from 'date-fns/format';
import { DateMode } from './lib/types';

interface ActiveFilterInfoProps {
  startDate: string;
  endDate: string;
  dateMode: DateMode;
}

export const ActiveFilterInfo = ({ startDate, endDate, dateMode }: ActiveFilterInfoProps) => {
  const daysDiff = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-slate-800/40 border border-white/15 rounded-xl p-4 mb-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        </div>
        <p className="text-sm text-indigo-100">
          Showing movies {dateMode === 'synced' ? 'synced' : 'released'} from{' '}
          <span className="font-semibold text-white">
            {format(new Date(startDate), 'MMM dd, yyyy')}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-white">
            {format(new Date(endDate), 'MMM dd, yyyy')}
          </span>
          <span className="text-indigo-200 ml-2">({daysDiff} days)</span>
        </p>
      </div>
    </div>
  );
};
