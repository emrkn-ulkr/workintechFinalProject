import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from '../hooks/useTranslation';
import { loginUser } from '../thunks/clientThunks';

function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values) => {
    try {
      await dispatch(
        loginUser({
          email: values.email.trim().toLowerCase(),
          password: values.password,
          rememberMe: values.rememberMe,
        }),
      );

      toast.success(t('loginPage.success'));

      if (location.state?.from?.pathname) {
        history.push(location.state.from.pathname);
      } else {
        history.push('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="mx-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('loginPage.label')}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{t('loginPage.title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
            {t('common.email')}
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: t('loginPage.emailRequired'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('loginPage.emailInvalid'),
              },
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">
            {t('common.password')}
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: t('loginPage.passwordRequired') })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" {...register('rememberMe')} className="h-4 w-4 rounded border-slate-300" />
          {t('loginPage.rememberMe')}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? t('loginPage.submitting') : t('common.login')}
        </button>
      </form>

      <p className="mt-4 text-xs text-ink-500">
        {t('loginPage.noAccount')}
        <Link to="/signup" className="ml-1 font-semibold text-brand-600 hover:text-brand-700">
          {t('loginPage.createOne')}
        </Link>
      </p>
    </section>
  );
}

export default LoginPage;
