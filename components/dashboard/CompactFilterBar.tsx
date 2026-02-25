import { Calendar, Filter } from 'lucide-react';
import { format } from 'date-fns/format';
import { subMonths } from 'date-fns/subMonths';
import { DateMode } from './lib/types';

interface CompactFilterBarProps {
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

export const CompactFilterBar = ({
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
}: CompactFilterBarProps) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const firstDayOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
  const last30Days = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
  const last3Months = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
  const last6Months = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
  const lastYear = format(subMonths(new Date(), 12), 'yyyy-MM-dd');

  const presets = [
    { label: 'Today', value: 'today', start: today, end: today },
    { label: 'This Month', value: 'this-month', start: firstDayOfMonth, end: today },
    { label: 'Last 30 Days', value: 'last-30', start: last30Days, end: today },
    { label: 'Last 3 Months', value: 'last-3', start: last3Months, end: today },
    { label: 'Last 6 Months', value: 'last-6', start: last6Months, end: today },
    { label: 'Last Year', value: 'last-year', start: lastYear, end: today },
  ];

  return (
    <div className="bg-slate-800/40 border border-white/15 rounded-2xl shadow-xl p-6 mb-8">
      {/* Top Row: Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-4 pb-4 border-b border-white/10">
        {/* Left: Icon + Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="p-2.5 bg-indigo-500 rounded-lg shadow-sm">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Filter Period</h3>
            <p className="text-xs text-indigo-100/70">
              {dateMode === 'synced' ? '🔄 By sync date' : '🎬 By release date'}
            </p>
          </div>
        </div>

        {/* Middle: Quick Presets */}
        <div className="flex flex-wrap gap-2 flex-1">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onQuickSelect(preset.start, preset.end, preset.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border cursor-pointer ${
                quickPreset === preset.value
                  ? 'bg-indigo-500 text-white border-indigo-400 shadow-md'
                  : 'bg-white/5 text-indigo-100 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Right: Mode Toggle */}
        <div className="flex gap-1 bg-slate-800/60 rounded-lg p-1 border border-white/10 flex-shrink-0">
          <button
            onClick={() => onDateModeChange('synced')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              dateMode === 'synced'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-indigo-100 hover:text-white hover:bg-white/5'
            }`}
          >
            🔄 Synced
          </button>
          <button
            onClick={() => onDateModeChange('release')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              dateMode === 'release'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-indigo-100 hover:text-white hover:bg-white/5'
            }`}
          >
            🎬 Released
          </button>
        </div>
      </div>

      {/* Bottom Row: Date Inputs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Calendar className="w-4 h-4 text-indigo-300 flex-shrink-0" />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-white/15 bg-white/5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
          />
          <span className="text-white/40 hidden sm:inline">—</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-white/15 bg-white/5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onApplyFilter}
            disabled={isDateRangeInvalid || !isFilterDirty}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${
              isDateRangeInvalid || !isFilterDirty
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md'
            }`}
          >
            {isFilterDirty ? 'Apply' : 'Applied'}
          </button>
          <button
            onClick={onResetToLastMonth}
            className="px-4 py-2 text-sm bg-white/10 border border-white/15 text-white rounded-lg hover:bg-white/15 transition-all font-medium cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
