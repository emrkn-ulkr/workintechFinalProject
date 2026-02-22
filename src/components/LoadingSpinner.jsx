import { LoaderCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

function LoadingSpinner({ label }) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 py-10 text-ink-700">
      <LoaderCircle className="h-8 w-8 animate-spin text-brand-600" />
      <p className="text-sm font-medium">{label || t('common.loading')}</p>
    </div>
  );
}

export default LoadingSpinner;
