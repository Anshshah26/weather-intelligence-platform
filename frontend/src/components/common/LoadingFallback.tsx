export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[350px] p-6 text-center">
      <div className="w-8 h-8 border-2 border-[#2F80ED]/30 border-t-[#2F80ED] rounded-full animate-spin mb-3" />
      <span className="text-xs font-medium text-[#9AA8B2] tracking-wide font-mono">
        Loading Meteorological Modules...
      </span>
    </div>
  );
};
