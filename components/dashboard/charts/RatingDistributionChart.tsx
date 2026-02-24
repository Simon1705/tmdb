import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomRatingPopularityTooltip } from '../lib/tooltips';
import { Movie } from '../lib/types';

interface RatingChartData {
  range: string;
  count: number;
  avgPopularity: number;
}

interface RatingDistributionChartProps {
  data: RatingChartData[];
  movies: Movie[];
}

export const RatingDistributionChart = ({ data, movies }: RatingDistributionChartProps) => {
  const avgRating = movies.length > 0
    ? (movies.reduce((sum, m) => sum + (m.vote_average || 0), 0) / movies.length).toFixed(2)
    : '0.00';
  
  const avgPopularity = movies.length > 0
    ? (movies.reduce((sum, m) => sum + (m.popularity || 0), 0) / movies.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Rating Distribution & Popularity</h2>
          <p className="text-sm text-indigo-100/80 mt-1">Movie count by rating with average popularity</p>
        </div>
        <div className="px-3 py-1 bg-white/10 text-amber-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
          Composed Chart
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart 
          data={data}
          margin={{ top: 5, right: 30, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis 
            dataKey="range" 
            tick={{ fill: '#E5E7EB', fontSize: 12 }}
            tickLine={{ stroke: '#475569' }}
            label={{ value: 'Rating Range', position: 'insideBottom', offset: -5, fill: '#E5E7EB', fontSize: 12 }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fill: '#E5E7EB', fontSize: 12 }}
            tickLine={{ stroke: '#475569' }}
            allowDecimals={false}
            label={{ value: 'Movie Count', angle: -90, position: 'insideLeft', fill: '#E5E7EB', fontSize: 11 }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#E5E7EB', fontSize: 12 }}
            tickLine={{ stroke: '#475569' }}
            label={{ value: 'Avg Popularity', angle: 90, position: 'insideRight', fill: '#E5E7EB', fontSize: 11 }}
          />
          <Tooltip 
            content={<CustomRatingPopularityTooltip />} 
            cursor={{ fill: 'rgba(251, 191, 36, 0.1)' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar 
            yAxisId="left"
            dataKey="count" 
            fill="url(#ratingGradient)" 
            name="Movies"
            radius={[8, 8, 0, 0]}
            animationBegin={0}
            animationDuration={800}
          />
          <Line 
            yAxisId="right"
            type="monotone"
            dataKey="avgPopularity" 
            stroke="#A855F7"
            strokeWidth={3}
            name="Avg Popularity"
            dot={{ fill: '#A855F7', r: 5 }}
            activeDot={{ r: 7 }}
            animationBegin={400}
            animationDuration={800}
          />
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={1}/>
              <stop offset="100%" stopColor="#D97706" stopOpacity={1}/>
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
                            
      {/* Stats summary */}
      <div className="mt-3 flex items-center justify-between text-sm bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
          <span className="text-indigo-100/80">Total Movies:</span>
          <span className="font-bold text-white">{movies.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-indigo-100/80">Avg Rating:</span>
          <span className="font-bold text-white">{avgRating}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-indigo-100/80">Avg Popularity:</span>
          <span className="font-bold text-white">{avgPopularity}</span>
        </div>
      </div>
    </div>
  );
};
