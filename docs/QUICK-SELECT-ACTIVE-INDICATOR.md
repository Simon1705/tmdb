# Quick Select Active Indicator

## Problem
Quick select buttons di date filter tidak memiliki active indicator, sehingga user tidak tahu preset mana yang sedang aktif. Default juga tidak jelas.

## Solution
Menambahkan active indicator untuk quick select buttons dan set default ke "Last 30 Days":

### 1. Active Indicator Styling
- Button aktif: `bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/30`
- Button tidak aktif: `bg-white/10 text-indigo-100 border-white/15`
- Smooth transition saat berubah

### 2. Preset Tracking
- Menambahkan `quickPreset` state di `useDateFilter` hook
- Default value: `'last-30'` (Last 30 Days)
- Auto-detect preset saat user apply filter manual
- Set ke `'custom'` saat user manual input tanggal

### 3. Auto-Apply on Quick Select
- Quick select langsung apply filter tanpa perlu klik "Apply Filter"
- Smooth transition dengan setTimeout untuk koordinasi state

### 4. Preset Detection
- Fungsi `detectPreset` untuk mendeteksi preset dari date range
- Mendukung: today, this-month, last-30, last-3, last-6, last-year, custom

## Features
- Visual indicator untuk preset yang aktif
- Default "Last 30 Days" saat pertama load
- Auto-apply saat quick select diklik
- Smart detection saat manual input match dengan preset
- Set ke "custom" saat user manual input tanggal

## Technical Details

### Hook Changes
```typescript
const [quickPreset, setQuickPreset] = useState<QuickPreset>('last-30');

const detectPreset = (start: string, end: string): QuickPreset => {
  // Logic to detect which preset matches current dates
};

const handleQuickSelect = (start: string, end: string, preset?: string) => {
  setStartDate(start);
  setEndDate(end);
  setQuickPreset((preset as QuickPreset) || 'custom');
  // Auto-apply
  setTimeout(() => {
    setAppliedFilters({ startDate: start, endDate: end, dateMode });
  }, 0);
};
```

### Component Changes
```tsx
<button
  onClick={() => onQuickSelect(last30Days, today, 'last-30')}
  className={`... ${
    quickPreset === 'last-30'
      ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg'
      : 'bg-white/10 text-indigo-100 border-white/15'
  }`}
>
  Last 30 Days
</button>
```

## Files Changed
- `components/dashboard/DateFilter.tsx`
- `components/dashboard/hooks/useDateFilter.ts`
- `app/dashboard/page.tsx`

## Result
- Clear visual feedback untuk preset aktif
- Default "Last 30 Days" saat load
- Better UX dengan auto-apply
- Smart preset detection
