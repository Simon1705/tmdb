import { Calendar } from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { DateMode } from './lib/types';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  dateMode: DateMode;
  quickPreset?: string;
  isDateRangeInvalid: boolean;
  isFilterDirty: boolean;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onDateModeChange: (mode: DateMode) => void;
  onApplyFilter: () => void;
  onResetToLastMonth: () => void;
  onQuickSelect: (startDate: string, endDate: string, preset?: string) => void;
}

export const DateFilter = ({
  startDate,
  endDate,
  dateMode,
  quickPreset = 'last-30',
  isDateRangeInvalid,
  isFilterDirty,
  onStartDateChange,
  onEndDateChange,
  onDateModeChange,
  onApplyFilter,
  onResetToLastMonth,
  onQuickSelect,
}: DateFilterProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const firstDayOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
  const last30Days = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
  const last3Months = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
  const last6Months = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
  const lastYear = format(subMonths(new Date(), 12), 'yyyy-MM-dd');

  return (
    <div className="bg-slate-800/40 border border-white/15 rounded-2xl shadow-xl p-6 mb-8">
      {/* Date Mode Toggle */}
      <div className="mb-6 pb-6 border-b border-white/10">
        <label className="block text-sm font-semibold text-indigo-100 mb-3">
          Filter By
        </label>
        <div className="inline-flex rounded-lg border border-white/20 bg-slate-800/60 p-1 shadow-sm">
          <button
            onClick={() => onDateModeChange('synced')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              dateMode === 'synced'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'text-indigo-100 hover:text-white hover:bg-white/5'
            }`}
          >
            🔄 Last Synced
          </button>
          <button
            onClick={() => onDateModeChange('release')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              dateMode === 'release'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                : 'text-indigo-100 hover:text-white hover:bg-white/5'
            }`}
          >
            🎬 Release Date
          </button>
        </div>
        <p className="text-xs text-indigo-100/80 mt-2">
          {dateMode === 'synced' 
            ? '🔄 Shows movies by their last sync/update date' 
            : '🎥 Shows movies by their theatrical release date'}
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500 rounded-lg shadow-sm">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Date Range Filter</h3>
            <p className="text-sm text-indigo-100/80">Select period to analyze</p>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-indigo-100 mb-2">
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-inner shadow-black/10 hover:border-white/25"
            />
          </div>
          
          <div className="hidden sm:flex items-end pb-3">
            <div className="w-8 h-0.5 bg-white/20"></div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-semibold text-indigo-100 mb-2">
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-white/15 bg-white/5 text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all shadow-inner shadow-black/10 hover:border-white/25"
            />
          </div>
          
          <button
            onClick={onResetToLastMonth}
            className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/15 hover:border-white/30 transition-all font-semibold shadow-md shadow-black/10 whitespace-nowrap cursor-pointer"
          >
            Reset to Last Month
          </button>

          <button
            onClick={onApplyFilter}
            disabled={isDateRangeInvalid || !isFilterDirty}
            className={`px-6 py-3 rounded-lg font-semibold shadow-md whitespace-nowrap cursor-pointer transition-all ${
              isDateRangeInvalid || !isFilterDirty
                ? 'bg-gray-600 border border-gray-500 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 border border-indigo-500 text-white hover:bg-indigo-500 hover:border-indigo-400 shadow-indigo-500/30'
            }`}
          >
            {isFilterDirty ? 'Apply Filter' : 'Applied'}
          </button>
        </div>
      </div>
      
      {/* Quick Filters */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs font-medium text-indigo-100/80 mb-2">Quick Select:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onQuickSelect(today, today, 'today')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
              quickPreset === 'today'
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => onQuickSelect(firstDayOfMonth, today, 'this-month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
              quickPreset === 'this-month'
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => onQuickSelect(last30Days, today, 'last-30')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
              quickPreset === 'last-30'
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => onQuickSelect(last3Months, today, 'last-3')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
              quickPreset === 'last-3'
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
            }`}
          >
            Last 3 Months
          </button>
          <button
            onClick={() => onQuickSelect(last6Months, today, 'last-6')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
              quickPreset === 'last-6'
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
            }`}
          >
            Last 6 Months
          </button>
          <button
            onClick={() => onQuickSelect(lastYear, today, 'last-year')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border cursor-pointer ${
              quickPreset === 'last-year'
                ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'bg-white/10 text-indigo-100 border-white/15 hover:bg-white/15 hover:text-white'
            }`}
          >
            Last Year
          </button>
        </div>
      </div>
    </div>
  );
};
