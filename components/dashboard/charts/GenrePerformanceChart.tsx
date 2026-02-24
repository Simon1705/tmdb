import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomGenrePerformanceTooltip } from '../lib/tooltips';

interface GenrePerformanceData {
  genre: string;
  rating: number;
  count: number;
  confidence: number;
}

interface GenrePerformanceChartProps {
  data: GenrePerformanceData[];
}

export const GenrePerformanceChart = ({ data }: GenrePerformanceChartProps) => {
  const highestRating = data.length > 0 ? Math.max(...data.map(d => d.rating)) : 0;
  const lowestRating = data.length > 0 ? Math.min(...data.map(d => d.rating)) : 0;

  return (
    <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Genre Performance</h2>
          <p className="text-sm text-indigo-100/80 mt-1">Average rating by genre</p>
        </div>
        <div className="px-3 py-1 bg-white/10 text-emerald-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
          Bar Chart
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            type="number"
            domain={[0, 10]}
            tick={{ fill: '#E5E7EB', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
            label={{ value: 'Average Rating', position: 'insideBottom', offset: -5, fill: '#E5E7EB', fontSize: 11 }}
          />
          <YAxis 
            type="category"
            dataKey="genre"
            tick={{ fill: '#E5E7EB', fontSize: 11 }}
            tickLine={{ stroke: '#475569' }}
            width={80}
          />
          <Tooltip 
            content={<CustomGenrePerformanceTooltip />} 
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
          />
          <Bar 
            dataKey="rating" 
            fill="url(#genreGradient)" 
            name="Rating"
            radius={[0, 8, 8, 0]}
            animationBegin={0}
            animationDuration={800}
            className="hover:opacity-80 transition-opacity"
          />
          <defs>
            <linearGradient id="genreGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10B981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
                    
      {/* Stats summary */}
      <div className="mt-3 flex items-center justify-between text-sm bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          <span className="text-indigo-100/80">Genres Shown:</span>
          <span className="font-bold text-white">{data.length}</span>
        </div>
        {data.length > 0 && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-indigo-100/80">Highest:</span>
              <span className="font-bold text-white">{highestRating.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-100/80">Lowest:</span>
              <span className="font-bold text-white">{lowestRating.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
