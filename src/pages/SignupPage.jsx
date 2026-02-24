import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { LoaderCircle } from 'lucide-react';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from '../hooks/useTranslation';
import { fetchRolesIfNeeded, signupUser } from '../thunks/clientThunks';

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const taxPattern = /^T\d{4}V\d{6}$/i;
const normalizeIban = (value) => value.replace(/\s+/g, '').toUpperCase();
const normalizePhone = (value) => value.replace(/\D+/g, '');

const isValidTurkiyePhone = (value) => {
  const normalized = normalizePhone(value);
  return /^(90)?5\d{9}$/.test(normalized) || /^0?5\d{9}$/.test(normalized);
};

const toApiPhone = (value) => {
  const normalized = normalizePhone(value);

  if (normalized.startsWith('90')) {
    return `0${normalized.slice(2)}`;
  }

  if (normalized.startsWith('5')) {
    return `0${normalized}`;
  }

  return normalized;
};

const isValidTrIban = (value) => {
  const normalized = normalizeIban(value);

  if (!/^TR\d{24}$/.test(normalized)) {
    return false;
  }

  const rearranged = `${normalized.slice(4)}${normalized.slice(0, 4)}`;
  const expanded = rearranged.replace(/[A-Z]/g, (letter) => String(letter.charCodeAt(0) - 55));

  let remainder = 0;
  for (const digit of expanded) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
};

function SignupPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const roles = useSelector((state) => state.client.roles);
  const [isRolesLoading, setIsRolesLoading] = useState(true);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    shouldUnregister: true,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      role_id: '',
      store: {
        name: '',
        phone: '',
        tax_no: '',
        bank_account: '',
      },
    },
  });

  const selectedRoleId = useWatch({ control, name: 'role_id' });
  const passwordValue = useWatch({ control, name: 'password' });
  const selectedRole = roles.find((role) => String(role.id) === String(selectedRoleId));

  const isStore = selectedRole?.code === 'store';

  useEffect(() => {
    let isMounted = true;

    const loadRoles = async () => {
      setIsRolesLoading(true);
      try {
        await dispatch(fetchRolesIfNeeded());
      } catch (error) {
        toast.error(error.message);
      } finally {
        if (isMounted) {
          setIsRolesLoading(false);
        }
      }
    };

    loadRoles();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (roles.length === 0 || selectedRoleId) {
      return;
    }

    const customerRole = roles.find((role) => role.code === 'customer');
    const fallbackRole = customerRole || roles[0];

    if (fallbackRole) {
      setValue('role_id', String(fallbackRole.id), { shouldValidate: true });
    }
  }, [roles, selectedRoleId, setValue]);

  const onSubmit = async (formValues) => {
    const parsedRoleId = Number(formValues.role_id);
    const submittedRole = roles.find((role) => Number(role.id) === parsedRoleId);
    const isStoreRole = submittedRole?.code === 'store';

    if (!parsedRoleId || !submittedRole) {
      toast.error(t('signupPage.roleRequired'));
      return;
    }

    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim().toLowerCase(),
      password: formValues.password,
      role_id: parsedRoleId,
    };

    if (isStoreRole) {
      payload.store = {
        name: formValues.store.name.trim(),
        phone: toApiPhone(formValues.store.phone),
        tax_no: formValues.store.tax_no.trim().toUpperCase(),
        bank_account: normalizeIban(formValues.store.bank_account),
      };
    }

    try {
      await dispatch(signupUser(payload));
      toast.warning(t('signupPage.activationWarning'));

      if (location.state?.from?.pathname) {
        history.push(location.state.from.pathname);
      } else if (history.length > 1) {
        history.goBack();
      } else {
        history.push('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('signupPage.label')}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{t('signupPage.title')}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink-700">
            {t('common.name')}
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: t('signupPage.nameRequired'),
              minLength: { value: 3, message: t('signupPage.nameMin') },
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
            {t('common.email')}
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: t('signupPage.emailRequired'),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t('signupPage.emailInvalid'),
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
            {...register('password', {
              required: t('signupPage.passwordRequired'),
              pattern: {
                value: passwordPattern,
                message: t('signupPage.passwordRule'),
              },
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <p className="mt-1 text-xs text-ink-500">{t('signupPage.passwordRule')}</p>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="mb-1 block text-sm font-medium text-ink-700">
            {t('signupPage.passwordValidation')}
          </label>
          <input
            id="passwordConfirm"
            type="password"
            {...register('passwordConfirm', {
              required: t('signupPage.confirmRequired'),
              validate: (value) => value === passwordValue || t('signupPage.confirmMismatch'),
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.passwordConfirm && <p className="mt-1 text-xs text-red-600">{errors.passwordConfirm.message}</p>}
        </div>

        <div>
          <label htmlFor="role_id" className="mb-1 block text-sm font-medium text-ink-700">
            {t('signupPage.role')}
          </label>
          <select
            id="role_id"
            {...register('role_id', { required: t('signupPage.roleRequired') })}
            disabled={isRolesLoading || roles.length === 0}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {isRolesLoading && <option value="">{t('common.loading')}</option>}
            {!isRolesLoading && roles.length === 0 && <option value="">{t('signupPage.roleUnavailable')}</option>}
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.role_id && <p className="mt-1 text-xs text-red-600">{errors.role_id.message}</p>}
        </div>

        {isStore && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-ink-700">{t('signupPage.storeInfo')}</p>

            <div>
              <label htmlFor="storeName" className="mb-1 block text-sm font-medium text-ink-700">
                {t('signupPage.storeName')}
              </label>
              <input
                id="storeName"
                type="text"
                {...register('store.name', {
                  required: t('signupPage.storeNameRequired'),
                  minLength: { value: 3, message: t('signupPage.storeNameMin') },
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.store?.name && <p className="mt-1 text-xs text-red-600">{errors.store.name.message}</p>}
            </div>

            <div>
              <label htmlFor="storePhone" className="mb-1 block text-sm font-medium text-ink-700">
                {t('signupPage.storePhone')}
              </label>
              <input
                id="storePhone"
                type="text"
                {...register('store.phone', {
                  required: t('signupPage.storePhoneRequired'),
                  validate: (value) => isValidTurkiyePhone(value) || t('signupPage.storePhoneInvalid'),
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.store?.phone && <p className="mt-1 text-xs text-red-600">{errors.store.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="taxNo" className="mb-1 block text-sm font-medium text-ink-700">
                {t('signupPage.storeTaxId')}
              </label>
              <input
                id="taxNo"
                type="text"
                placeholder="TXXXXVXXXXXX"
                {...register('store.tax_no', {
                  required: t('signupPage.taxRequired'),
                  pattern: {
                    value: taxPattern,
                    message: t('signupPage.taxInvalid'),
                  },
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.store?.tax_no && <p className="mt-1 text-xs text-red-600">{errors.store.tax_no.message}</p>}
            </div>

            <div>
              <label htmlFor="iban" className="mb-1 block text-sm font-medium text-ink-700">
                {t('signupPage.storeBankAccount')}
              </label>
              <input
                id="iban"
                type="text"
                placeholder="TRXXXXXXXXXXXXXXXXXXXXXXXX"
                {...register('store.bank_account', {
                  required: t('signupPage.bankRequired'),
                  validate: (value) => isValidTrIban(value) || t('signupPage.bankInvalid'),
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.store?.bank_account && (
                <p className="mt-1 text-xs text-red-600">{errors.store.bank_account.message}</p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isRolesLoading || roles.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              {t('signupPage.submitting')}
            </>
          ) : (
            t('signupPage.submit')
          )}
        </button>
      </form>
    </section>
  );
}

export default SignupPage;
