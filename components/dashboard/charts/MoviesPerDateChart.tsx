import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomBarTooltip } from '../lib/tooltips';

interface DateChartData {
  date: string;
  fullDate: string;
  count: number;
}

interface MoviesPerDateChartProps {
  data: DateChartData[];
  dateMode: 'synced' | 'release';
}

export const MoviesPerDateChart = ({ data, dateMode }: MoviesPerDateChartProps) => {
  const totalMovies = data.reduce((sum, item) => sum + item.count, 0);
  const limitedData = data.slice(-20); // Show last 20 dates

  return (
    <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            Movies by {dateMode === 'synced' ? 'Sync' : 'Release'} Date
          </h2>
          <p className="text-sm text-indigo-100/80 mt-1">Recent timeline distribution</p>
        </div>
        <div className="px-3 py-1 bg-white/10 text-emerald-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
          Bar Chart
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={limitedData}
          margin={{ top: 5, right: 5, left: -20, bottom: limitedData.length > 10 ? 5 : 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#E5E7EB', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
            angle={limitedData.length > 10 ? -30 : 0}
            textAnchor={limitedData.length > 10 ? 'end' : 'middle'}
            height={limitedData.length > 10 ? 70 : 30}
            dy={limitedData.length > 10 ? 10 : 0}
          />
          <YAxis 
            tick={{ fill: '#E5E7EB', fontSize: 12 }}
            tickLine={{ stroke: '#475569' }}
            allowDecimals={false}
          />
          <Tooltip 
            content={<CustomBarTooltip />} 
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />
          <Bar 
            dataKey="count" 
            fill="url(#colorGradient)" 
            name="Movies"
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={800}
            className="hover:opacity-80 transition-opacity"
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1}/>
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity={1}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Stats summary */}
      <div className="mt-3 flex items-center justify-between text-sm bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
          <span className="text-indigo-100/80">Total Movies:</span>
          <span className="font-bold text-white">{totalMovies}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-indigo-100/80">Showing:</span>
          <span className="font-bold text-white">{limitedData.length} of {data.length} days</span>
        </div>
      </div>
      
      {data.length > 20 && (
        <div className="mt-3 text-xs text-indigo-200 bg-white/5 rounded-lg p-2 border border-white/10">
          ℹ️ Showing last 20 dates for better readability. Total: {data.length} dates
        </div>
      )}
    </div>
  );
};
