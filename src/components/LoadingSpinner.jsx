import { LoaderCircle } from 'lucide-react';

function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 py-10 text-ink-700">
      <LoaderCircle className="h-8 w-8 animate-spin text-brand-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
