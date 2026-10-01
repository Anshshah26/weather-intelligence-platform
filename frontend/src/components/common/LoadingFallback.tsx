export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-6 text-center animate-fade-in">
      <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-3" />
      <span className="text-xs font-semibold text-slate-300 tracking-wide">
        Loading Weather Intelligence...
      </span>
    </div>
  );
};
