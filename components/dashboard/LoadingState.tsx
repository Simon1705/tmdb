export const LoadingState = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-slate-800/40 rounded-xl shadow-xl p-6 border border-white/15">
          <div className="h-6 w-48 bg-white/10 animate-pulse rounded mb-6"></div>
          <div className="h-[300px] bg-white/10 animate-pulse rounded"></div>
        </div>
      ))}
    </div>
  );
};
