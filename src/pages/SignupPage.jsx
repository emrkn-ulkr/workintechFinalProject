import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchRolesIfNeeded, signupUser } from '../thunks/clientThunks';

const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
const phonePattern = /^(?:\+?90|0)?5\d{9}$/;
const taxPattern = /^T\d{4}V\d{6}$/i;

function SignupPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const roles = useSelector((state) => state.client.roles);
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
    dispatch(fetchRolesIfNeeded());
  }, [dispatch]);

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      const customerRole = roles.find((role) => role.code === 'customer');
      if (customerRole) {
        setValue('role_id', String(customerRole.id));
      }
    }
  }, [roles, selectedRoleId, setValue]);

  const onSubmit = async (formValues) => {
    const payload = {
      name: formValues.name.trim(),
      email: formValues.email.trim().toLowerCase(),
      password: formValues.password,
      role_id: Number(formValues.role_id),
    };

    if (isStore) {
      payload.store = {
        name: formValues.store.name.trim(),
        phone: formValues.store.phone.trim(),
        tax_no: formValues.store.tax_no.trim().toUpperCase(),
        bank_account: formValues.store.bank_account.replace(/\s+/g, '').toUpperCase(),
      };
    }

    try {
      await dispatch(signupUser(payload));
      toast.warning('You need to click link in email to activate your account!');

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
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Sign Up</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">Create your account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink-700">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Name is required.',
              minLength: { value: 3, message: 'Name should be at least 3 characters.' },
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email.',
              },
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Password is required.',
              pattern: {
                value: passwordPattern,
                message:
                  'Password must be at least 8 chars and include number, lower, upper and special character.',
              },
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="mb-1 block text-sm font-medium text-ink-700">
            Password Validation
          </label>
          <input
            id="passwordConfirm"
            type="password"
            {...register('passwordConfirm', {
              required: 'Please confirm your password.',
              validate: (value) => value === passwordValue || 'Passwords do not match.',
            })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          {errors.passwordConfirm && <p className="mt-1 text-xs text-red-600">{errors.passwordConfirm.message}</p>}
        </div>

        <div>
          <label htmlFor="role_id" className="mb-1 block text-sm font-medium text-ink-700">
            Role
          </label>
          <select
            id="role_id"
            {...register('role_id', { required: 'Role is required.' })}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
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
            <p className="text-sm font-semibold text-ink-700">Store Information</p>

            <div>
              <label htmlFor="storeName" className="mb-1 block text-sm font-medium text-ink-700">
                Store Name
              </label>
              <input
                id="storeName"
                type="text"
                {...register('store.name', {
                  required: 'Store name is required.',
                  minLength: { value: 3, message: 'Store name should be at least 3 characters.' },
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.store?.name && <p className="mt-1 text-xs text-red-600">{errors.store.name.message}</p>}
            </div>

            <div>
              <label htmlFor="storePhone" className="mb-1 block text-sm font-medium text-ink-700">
                Store Phone
              </label>
              <input
                id="storePhone"
                type="text"
                {...register('store.phone', {
                  required: 'Store phone is required.',
                  pattern: {
                    value: phonePattern,
                    message: 'Please enter a valid Turkiye phone number.',
                  },
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.store?.phone && <p className="mt-1 text-xs text-red-600">{errors.store.phone.message}</p>}
            </div>

            <div>
              <label htmlFor="taxNo" className="mb-1 block text-sm font-medium text-ink-700">
                Store Tax ID
              </label>
              <input
                id="taxNo"
                type="text"
                placeholder="TXXXXVXXXXXX"
                {...register('store.tax_no', {
                  required: 'Tax number is required.',
                  pattern: {
                    value: taxPattern,
                    message: 'Tax no must match TXXXXVXXXXXX pattern.',
                  },
                })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              {errors.store?.tax_no && <p className="mt-1 text-xs text-red-600">{errors.store.tax_no.message}</p>}
            </div>

            <div>
              <label htmlFor="iban" className="mb-1 block text-sm font-medium text-ink-700">
                Store Bank Account
              </label>
              <input
                id="iban"
                type="text"
                placeholder="TRXXXXXXXXXXXXXXXXXXXXXXXX"
                {...register('store.bank_account', {
                  required: 'Bank account is required.',
                  validate: (value) => {
                    const normalized = value.replace(/\s+/g, '').toUpperCase();
                    return /^TR\d{24}$/.test(normalized) || 'Please enter a valid TR IBAN.';
                  },
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
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Submitting...' : 'Sign Up'}
        </button>
      </form>
    </section>
  );
}

export default SignupPage;
