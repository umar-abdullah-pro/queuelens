const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" />

      <p className="mt-5 text-sm font-semibold text-slate-700">
        Loading QueueLens...
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Please wait while we prepare your dashboard.
      </p>
    </div>
  );
};

export default LoadingScreen;
