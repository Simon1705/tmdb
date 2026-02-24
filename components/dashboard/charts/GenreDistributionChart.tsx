import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CustomPieTooltip } from '../lib/tooltips';
import { COLORS } from '../lib/constants';

interface GenreData {
  name: string;
  value: number;
  total?: number;
}

interface GenreDistributionChartProps {
  data: GenreData[];
  totalMovies: number;
  otherGenresCount: number;
}

export const GenreDistributionChart = ({ data, totalMovies, otherGenresCount }: GenreDistributionChartProps) => {
  const [activePieIndex, setActivePieIndex] = useState<number | null>(null);

  return (
    <div className="bg-slate-800/40 rounded-2xl shadow-xl p-6 border border-white/15 hover:border-white/25 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Genre Distribution</h2>
          <p className="text-sm text-indigo-100/80 mt-1">Top genres by movie count</p>
        </div>
        <div className="px-3 py-1 bg-white/10 text-indigo-100 rounded-full text-xs font-semibold shadow-sm border border-white/20">
          Pie Chart
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Chart */}
        <div className="flex-shrink-0 w-full lg:w-auto">
          <ResponsiveContainer width={280} height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={3}
                animationBegin={0}
                animationDuration={800}
                onMouseEnter={(_, index) => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Others' ? '#9CA3AF' : COLORS[index % COLORS.length]}
                    className="transition-all cursor-pointer"
                    style={{
                      opacity: activePieIndex === null || activePieIndex === index ? 1 : 0.3,
                      filter: activePieIndex === index ? 'brightness(1.2)' : 'none',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex-1 w-full">
          <div className="space-y-2">
            {data.map((entry, index) => (
              <div 
                key={index}
                onMouseEnter={() => setActivePieIndex(index)}
                onMouseLeave={() => setActivePieIndex(null)}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-all cursor-pointer group ${
                  activePieIndex === index
                    ? 'bg-white/15 border-white/40 scale-105 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className={`rounded-full flex-shrink-0 transition-all ${
                      activePieIndex === index ? 'w-5 h-5 ring-2 ring-white/50' : 'w-4 h-4'
                    }`}
                    style={{ backgroundColor: entry.name === 'Others' ? '#9CA3AF' : COLORS[index % COLORS.length] }}
                  ></div>
                  <span className={`text-sm font-medium truncate transition-colors ${
                    activePieIndex === index ? 'text-white' : 'text-indigo-100 group-hover:text-white'
                  }`}>
                    {entry.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-lg font-bold text-white">
                    {entry.value}
                  </span>
                  <span className={`text-sm font-medium px-2 py-1 rounded transition-all ${
                    activePieIndex === index 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/10 text-indigo-200'
                  }`}>
                    {((entry.value / totalMovies) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {otherGenresCount > 0 && (
        <div className="mt-4 text-xs text-indigo-200 bg-white/5 rounded-lg p-2 border border-white/10">
          ℹ️ Showing top 4 genres. {otherGenresCount} other genres grouped as "Others"
        </div>
      )}
    </div>
  );
};
