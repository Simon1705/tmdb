import { useState } from 'react';
import { subMonths } from 'date-fns/subMonths';
import { format } from 'date-fns/format';
import { DateMode, QuickPreset, AppliedFilters } from '../lib/types';

export const useDateFilter = () => {
  const defaultStartDate = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
  const defaultEndDate = format(new Date(), 'yyyy-MM-dd');
  
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [dateMode, setDateMode] = useState<DateMode>('synced');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    dateMode: 'synced',
  });
  const [quickPreset, setQuickPreset] = useState<QuickPreset>('last-30');

  const isDateRangeInvalid = new Date(startDate).getTime() > new Date(endDate).getTime();
  const isFilterDirty =
    startDate !== appliedFilters.startDate ||
    endDate !== appliedFilters.endDate ||
    dateMode !== appliedFilters.dateMode;

  // Detect if current dates match a preset
  const detectPreset = (start: string, end: string): QuickPreset => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const firstDayOfMonth = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd');
    const last30Days = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
    const last3Months = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
    const last6Months = format(subMonths(new Date(), 6), 'yyyy-MM-dd');
    const lastYear = format(subMonths(new Date(), 12), 'yyyy-MM-dd');

    if (start === today && end === today) return 'today';
    if (start === firstDayOfMonth && end === today) return 'this-month';
    if (start === last30Days && end === today) return 'last-30';
    if (start === last3Months && end === today) return 'last-3';
    if (start === last6Months && end === today) return 'last-6';
    if (start === lastYear && end === today) return 'last-year';
    return 'custom';
  };

  const applyPreset = (preset: Exclude<QuickPreset, 'custom'>) => {
    const today = new Date();
    const todayFormatted = format(today, 'yyyy-MM-dd');
    let nextStartDate = todayFormatted;

    if (preset === 'this-month') {
      const firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
      nextStartDate = format(firstDate, 'yyyy-MM-dd');
    } else if (preset === 'last-30') {
      nextStartDate = format(subMonths(today, 1), 'yyyy-MM-dd');
    } else if (preset === 'last-3') {
      nextStartDate = format(subMonths(today, 3), 'yyyy-MM-dd');
    } else if (preset === 'last-6') {
      nextStartDate = format(subMonths(today, 6), 'yyyy-MM-dd');
    } else if (preset === 'last-year') {
      nextStartDate = format(subMonths(today, 12), 'yyyy-MM-dd');
    }

    setStartDate(nextStartDate);
    setEndDate(todayFormatted);
    setQuickPreset(preset);
  };

  const handleDateModeChange = (mode: DateMode) => {
    setDateMode(mode);
    // Auto-apply when date mode changes
    setAppliedFilters({
      startDate,
      endDate,
      dateMode: mode,
    });
  };

  const applyFilters = () => {
    const detectedPreset = detectPreset(startDate, endDate);
    setQuickPreset(detectedPreset);
    setAppliedFilters({
      startDate,
      endDate,
      dateMode,
    });
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    setQuickPreset('custom');
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    setQuickPreset('custom');
  };

  const handleQuickSelect = (start: string, end: string, preset?: string) => {
    setStartDate(start);
    setEndDate(end);
    setQuickPreset((preset as QuickPreset) || 'custom');
    // Auto-apply when quick select is used
    setTimeout(() => {
      setAppliedFilters({
        startDate: start,
        endDate: end,
        dateMode,
      });
    }, 0);
  };

  const resetFilters = () => {
    setStartDate(defaultStartDate);
    setEndDate(defaultEndDate);
    setDateMode('synced');
    setQuickPreset('last-30');
    setAppliedFilters({
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      dateMode: 'synced',
    });
  };

  return {
    startDate,
    endDate,
    dateMode,
    appliedFilters,
    quickPreset,
    isDateRangeInvalid,
    isFilterDirty,
    setStartDate: handleStartDateChange,
    setEndDate: handleEndDateChange,
    setDateMode: handleDateModeChange,
    setQuickPreset,
    applyPreset,
    applyFilters,
    resetFilters,
    handleQuickSelect,
  };
};
