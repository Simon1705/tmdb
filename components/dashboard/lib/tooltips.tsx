// Custom Tooltip Components for Dashboard Charts

export const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = payload[0].payload.total || 0;
    const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3">
        <p className="font-bold text-gray-900 mb-1">{data.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{data.value}</span> movies
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {percentage}% of total
        </p>
      </div>
    );
  }
  return null;
};

export const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3">
        <p className="font-bold text-gray-900 mb-1">{label}</p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{payload[0].value}</span> {payload[0].value === 1 ? 'movie' : 'movies'}
        </p>
      </div>
    );
  }
  return null;
};

export const CustomRatingPopularityTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const barData = payload.find((p: any) => p.dataKey === 'count');
    const lineData = payload.find((p: any) => p.dataKey === 'avgPopularity');
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3 min-w-[180px]">
        <p className="font-bold text-gray-900 mb-2">Rating {label}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Movies:</span>
            <span className="font-semibold text-blue-600">{barData?.value || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Avg Popularity:</span>
            <span className="font-semibold text-purple-600">
              {lineData?.value ? parseFloat(lineData.value).toFixed(1) : '0.0'}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const CustomGenrePerformanceTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-lg shadow-xl p-3 min-w-[180px]">
        <p className="font-bold text-gray-900 mb-2">{data.genre}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Average Rating:</span>
            <span className="font-semibold text-emerald-600">{data.rating} ⭐</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Movies:</span>
            <span className="font-semibold text-gray-700">{data.count}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Confidence:</span>
              <span className="text-xs font-bold text-blue-600">{data.confidence}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${data.confidence}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 italic">
              {data.count} {data.count === 1 ? 'movie' : 'movies'} • 10+ = 100%
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
