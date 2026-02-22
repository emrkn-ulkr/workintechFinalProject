import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setAddress, setPayment } from '../actions/shoppingCartActions';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTranslation } from '../hooks/useTranslation';
import {
  createUserAddress,
  createUserCard,
  deleteUserAddress,
  deleteUserCard,
  fetchUserAddresses,
  fetchUserCards,
  updateUserAddress,
  updateUserCard,
} from '../thunks/clientThunks';
import { createOrder } from '../thunks/orderThunks';

const phonePattern = /^(?:\+?90|0)?5\d{9}$/;

const emptyAddressForm = {
  title: '',
  name: '',
  surname: '',
  phone: '',
  city: '',
  district: '',
  neighborhood: '',
};

const emptyCardForm = {
  card_no: '',
  expire_month: '',
  expire_year: '',
  name_on_card: '',
};

const normalizeCardNo = (value = '') => value.replace(/\s+/g, '').replace(/[^\d]/g, '');

const cardMask = (value = '') => {
  const normalized = normalizeCardNo(value);
  if (normalized.length < 4) {
    return normalized;
  }

  return `**** **** **** ${normalized.slice(-4)}`;
};

function CreateOrderPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t, language } = useTranslation();

  const { cart } = useSelector((state) => state.shoppingCart);
  const { addressList, creditCards } = useSelector((state) => state.client);

  const [activeStep, setActiveStep] = useState(1);
  const [addressLoading, setAddressLoading] = useState(true);
  const [cardLoading, setCardLoading] = useState(true);
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const [shippingAddressId, setShippingAddressId] = useState('');
  const [receiptAddressId, setReceiptAddressId] = useState('');

  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  const [selectedCardId, setSelectedCardId] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installment, setInstallment] = useState('single');

  const [cardFormOpen, setCardFormOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [cardSaving, setCardSaving] = useState(false);
  const [cardForm, setCardForm] = useState(emptyCardForm);

  const selectedItems = useMemo(() => cart.filter((item) => item.checked), [cart]);

  const totals = useMemo(() => {
    const productsTotal = selectedItems.reduce((sum, item) => sum + Number(item.product.price || 0) * item.count, 0);
    const shipping = productsTotal > 0 ? 39.9 : 0;
    const discount = productsTotal > 1000 ? productsTotal * 0.08 : 0;
    const grandTotal = productsTotal + shipping - discount;

    return { productsTotal, shipping, discount, grandTotal };
  }, [selectedItems]);

  const selectedCard = useMemo(
    () => creditCards.find((card) => String(card.id) === String(selectedCardId)),
    [creditCards, selectedCardId],
  );

  const paymentOptions = useMemo(() => {
    if (!selectedCard) {
      return [{ value: 'single', label: t('createOrderPage.singlePayment') }];
    }

    const normalized = normalizeCardNo(String(selectedCard.card_no || ''));

    if (normalized.startsWith('4')) {
      return [
        { value: 'single', label: t('createOrderPage.singlePayment') },
        { value: '3', label: t('createOrderPage.installment3') },
      ];
    }

    return [
      { value: 'single', label: t('createOrderPage.singlePayment') },
      { value: '3', label: t('createOrderPage.installment3') },
      { value: '6', label: t('createOrderPage.installment6') },
    ];
  }, [selectedCard, t]);

  useEffect(() => {
    const bootstrap = async () => {
      setAddressLoading(true);
      setCardLoading(true);

      try {
        await Promise.all([dispatch(fetchUserAddresses()), dispatch(fetchUserCards())]);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setAddressLoading(false);
        setCardLoading(false);
      }
    };

    bootstrap();
  }, [dispatch]);

  useEffect(() => {
    if (!addressList.length) {
      return;
    }

    const firstId = String(addressList[0].id);

    if (!shippingAddressId) {
      setShippingAddressId(firstId);
    }

    if (!receiptAddressId) {
      setReceiptAddressId(firstId);
    }
  }, [addressList, shippingAddressId, receiptAddressId]);

  useEffect(() => {
    if (!creditCards.length) {
      return;
    }

    if (!selectedCardId) {
      setSelectedCardId(String(creditCards[0].id));
    }
  }, [creditCards, selectedCardId]);

  useEffect(() => {
    dispatch(
      setAddress({
        shipping_address_id: shippingAddressId ? Number(shippingAddressId) : null,
        receipt_address_id: receiptAddressId ? Number(receiptAddressId) : null,
      }),
    );
  }, [dispatch, shippingAddressId, receiptAddressId]);

  useEffect(() => {
    dispatch(
      setPayment({
        card_id: selectedCardId ? Number(selectedCardId) : null,
        card_ccv: cardCvv,
        installment,
      }),
    );
  }, [dispatch, selectedCardId, cardCvv, installment]);

  useEffect(() => {
    if (paymentOptions.some((option) => option.value === installment)) {
      return;
    }

    setInstallment(paymentOptions[0]?.value || 'single');
  }, [installment, paymentOptions]);

  const openNewAddressForm = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm);
    setAddressFormOpen(true);
  };

  const openEditAddressForm = (address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      title: address.title || '',
      name: address.name || '',
      surname: address.surname || '',
      phone: address.phone || '',
      city: address.city || '',
      district: address.district || '',
      neighborhood: address.neighborhood || '',
    });
    setAddressFormOpen(true);
  };

  const validateAddressForm = () => {
    const requiredFields = ['title', 'name', 'surname', 'phone', 'city', 'district', 'neighborhood'];

    for (const field of requiredFields) {
      if (!String(addressForm[field] || '').trim()) {
        toast.error(t('createOrderPage.addressFormRequired'));
        return false;
      }
    }

    if (!phonePattern.test(String(addressForm.phone).trim())) {
      toast.error(t('createOrderPage.addressPhoneInvalid'));
      return false;
    }

    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) {
      return;
    }

    const payload = {
      title: addressForm.title.trim(),
      name: addressForm.name.trim(),
      surname: addressForm.surname.trim(),
      phone: addressForm.phone.trim(),
      city: addressForm.city.trim().toLowerCase(),
      district: addressForm.district.trim().toLowerCase(),
      neighborhood: addressForm.neighborhood.trim(),
    };

    setAddressSaving(true);

    try {
      if (editingAddressId) {
        await dispatch(updateUserAddress({ id: editingAddressId, ...payload }));
        toast.success(t('createOrderPage.addressUpdated'));
      } else {
        await dispatch(createUserAddress(payload));
        toast.success(t('createOrderPage.addressCreated'));
      }

      setAddressFormOpen(false);
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await dispatch(deleteUserAddress(addressId));
      toast.success(t('createOrderPage.addressDeleted'));

      if (String(shippingAddressId) === String(addressId)) {
        setShippingAddressId('');
      }

      if (String(receiptAddressId) === String(addressId)) {
        setReceiptAddressId('');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openNewCardForm = () => {
    setEditingCardId(null);
    setCardForm(emptyCardForm);
    setCardFormOpen(true);
  };

  const openEditCardForm = (card) => {
    setEditingCardId(card.id);
    setCardForm({
      card_no: String(card.card_no || ''),
      expire_month: String(card.expire_month || ''),
      expire_year: String(card.expire_year || ''),
      name_on_card: String(card.name_on_card || ''),
    });
    setCardFormOpen(true);
  };

  const validateCardForm = () => {
    const normalizedCardNo = normalizeCardNo(cardForm.card_no);
    const month = Number(cardForm.expire_month);
    const year = Number(cardForm.expire_year);
    const currentYear = new Date().getFullYear();

    if (!normalizedCardNo || normalizedCardNo.length !== 16) {
      toast.error(t('createOrderPage.cardNoInvalid'));
      return false;
    }

    if (!cardForm.name_on_card.trim()) {
      toast.error(t('createOrderPage.cardNameRequired'));
      return false;
    }

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      toast.error(t('createOrderPage.cardMonthInvalid'));
      return false;
    }

    if (!Number.isInteger(year) || year < currentYear) {
      toast.error(t('createOrderPage.cardYearInvalid'));
      return false;
    }

    return true;
  };

  const handleSaveCard = async () => {
    if (!validateCardForm()) {
      return;
    }

    const payload = {
      card_no: normalizeCardNo(cardForm.card_no),
      expire_month: Number(cardForm.expire_month),
      expire_year: Number(cardForm.expire_year),
      name_on_card: cardForm.name_on_card.trim(),
    };

    setCardSaving(true);

    try {
      if (editingCardId) {
        await dispatch(updateUserCard({ id: editingCardId, ...payload }));
        toast.success(t('createOrderPage.cardUpdated'));
      } else {
        await dispatch(createUserCard(payload));
        toast.success(t('createOrderPage.cardCreated'));
      }

      setCardFormOpen(false);
      setEditingCardId(null);
      setCardForm(emptyCardForm);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCardSaving(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await dispatch(deleteUserCard(cardId));
      toast.success(t('createOrderPage.cardDeleted'));

      if (String(selectedCardId) === String(cardId)) {
        setSelectedCardId('');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoStep2 = () => {
    if (!shippingAddressId || !receiptAddressId) {
      toast.error(t('createOrderPage.selectAddressValidation'));
      return;
    }

    setActiveStep(2);
  };

  const handleCompleteOrder = async () => {
    if (!selectedItems.length) {
      toast.error(t('createOrderPage.emptySelectionValidation'));
      return;
    }

    if (!shippingAddressId) {
      toast.error(t('createOrderPage.selectAddressValidation'));
      return;
    }

    if (!selectedCard) {
      toast.error(t('createOrderPage.selectCardValidation'));
      return;
    }

    const normalizedCvv = String(cardCvv || '').replace(/\D+/g, '');

    if (normalizedCvv.length < 3 || normalizedCvv.length > 4) {
      toast.error(t('createOrderPage.cvvValidation'));
      return;
    }

    const payload = {
      address_id: Number(shippingAddressId),
      order_date: new Date().toISOString(),
      card_no: normalizeCardNo(String(selectedCard.card_no || '')),
      card_name: selectedCard.name_on_card,
      card_expire_month: Number(selectedCard.expire_month),
      card_expire_year: Number(selectedCard.expire_year),
      card_ccv: Number(normalizedCvv),
      price: Number(totals.grandTotal.toFixed(2)),
      products: selectedItems.map((item) => ({
        product_id: Number(item.product.id),
        count: item.count,
        detail: item.product?.name || 'standard',
      })),
    };

    setOrderSubmitting(true);

    try {
      await dispatch(createOrder(payload));
      toast.success(t('createOrderPage.orderSuccess'));
      history.push('/orders');
    } catch (error) {
      toast.error(error.message || t('createOrderPage.orderFailed'));
    } finally {
      setOrderSubmitting(false);
    }
  };

  const formatAddress = (address) =>
    `${address.title} - ${address.name} ${address.surname} (${address.city}/${address.district})`;

  if (addressLoading && cardLoading) {
    return <LoadingSpinner label={t('createOrderPage.loading')} />;
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{t('createOrderPage.label')}</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900">{t('createOrderPage.title')}</h1>
        <p className="mt-3 text-sm text-ink-600">{t('createOrderPage.description')}</p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              activeStep === 1 ? 'bg-brand-500 text-white' : 'border border-slate-300 text-ink-700'
            }`}
          >
            {t('createOrderPage.step1')}
          </button>
          <button
            type="button"
            onClick={handleGoStep2}
            className={`rounded-md px-4 py-2 text-sm font-semibold ${
              activeStep === 2 ? 'bg-brand-500 text-white' : 'border border-slate-300 text-ink-700'
            }`}
          >
            {t('createOrderPage.step2')}
          </button>
        </div>
      </div>

      {activeStep === 1 ? (
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-ink-900">{t('createOrderPage.savedAddresses')}</h2>
            <button
              type="button"
              onClick={openNewAddressForm}
              className="inline-flex items-center gap-2 rounded-md border border-brand-500 px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50"
            >
              <Plus className="h-4 w-4" />
              {t('createOrderPage.addAddress')}
            </button>
          </div>

          {addressList.length === 0 ? (
            <p className="text-sm text-ink-500">{t('createOrderPage.noAddress')}</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-3">
                <label className="w-full text-sm font-medium text-ink-700 sm:w-[calc(50%-0.375rem)]">
                  {t('createOrderPage.shippingAddress')}
                  <select
                    value={shippingAddressId}
                    onChange={(event) => setShippingAddressId(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">{t('createOrderPage.selectAddress')}</option>
                    {addressList.map((address) => (
                      <option key={address.id} value={address.id}>
                        {formatAddress(address)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="w-full text-sm font-medium text-ink-700 sm:w-[calc(50%-0.375rem)]">
                  {t('createOrderPage.receiptAddress')}
                  <select
                    value={receiptAddressId}
                    onChange={(event) => setReceiptAddressId(event.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">{t('createOrderPage.selectAddress')}</option>
                    {addressList.map((address) => (
                      <option key={address.id} value={address.id}>
                        {formatAddress(address)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                {addressList.map((address) => (
                  <div
                    key={address.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3"
                  >
                    <div className="text-sm text-ink-700">
                      <p className="font-semibold text-ink-900">{address.title}</p>
                      <p>
                        {address.name} {address.surname} - {address.phone}
                      </p>
                      <p>
                        {address.city} / {address.district}
                      </p>
                      <p>{address.neighborhood}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditAddressForm(address)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-slate-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {t('common.edit')}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t('common.delete')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {addressFormOpen && (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink-900">
                {editingAddressId ? t('createOrderPage.editAddress') : t('createOrderPage.addAddress')}
              </p>
              <div className="flex flex-wrap gap-3">
                <input
                  value={addressForm.title}
                  onChange={(event) => setAddressForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.addressTitle')}
                />
                <input
                  value={addressForm.phone}
                  onChange={(event) => setAddressForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.addressPhone')}
                />
                <input
                  value={addressForm.name}
                  onChange={(event) => setAddressForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.addressName')}
                />
                <input
                  value={addressForm.surname}
                  onChange={(event) => setAddressForm((current) => ({ ...current, surname: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.addressSurname')}
                />
                <input
                  value={addressForm.city}
                  onChange={(event) => setAddressForm((current) => ({ ...current, city: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.addressCity')}
                />
                <input
                  value={addressForm.district}
                  onChange={(event) => setAddressForm((current) => ({ ...current, district: event.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.addressDistrict')}
                />
              </div>
              <textarea
                rows={3}
                value={addressForm.neighborhood}
                onChange={(event) => setAddressForm((current) => ({ ...current, neighborhood: event.target.value }))}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder={t('createOrderPage.addressNeighborhood')}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={addressSaving}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {addressSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {editingAddressId ? t('common.update') : t('common.save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAddressFormOpen(false);
                    setEditingAddressId(null);
                    setAddressForm(emptyAddressForm);
                  }}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-ink-700"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleGoStep2}
              className="rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              {t('common.next')}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-ink-900">{t('createOrderPage.savedCards')}</h2>
            <button
              type="button"
              onClick={openNewCardForm}
              className="inline-flex items-center gap-2 rounded-md border border-brand-500 px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50"
            >
              <Plus className="h-4 w-4" />
              {t('createOrderPage.addCard')}
            </button>
          </div>

          {cardLoading ? (
            <LoadingSpinner label={t('createOrderPage.cardsLoading')} />
          ) : creditCards.length === 0 ? (
            <p className="text-sm text-ink-500">{t('createOrderPage.noCard')}</p>
          ) : (
            <div className="space-y-2">
              {creditCards.map((card) => (
                <label
                  key={card.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3"
                >
                  <div className="inline-flex items-center gap-3">
                    <input
                      type="radio"
                      name="selectedCard"
                      checked={String(selectedCardId) === String(card.id)}
                      onChange={() => setSelectedCardId(String(card.id))}
                    />
                    <div className="text-sm text-ink-700">
                      <p className="font-semibold text-ink-900">{card.name_on_card}</p>
                      <p>{cardMask(card.card_no)}</p>
                      <p>
                        {String(card.expire_month).padStart(2, '0')}/{card.expire_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditCardForm(card)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-slate-100"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {t('common.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t('common.delete')}
                    </button>
                  </div>
                </label>
              ))}
            </div>
          )}

          {cardFormOpen && (
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink-900">
                {editingCardId ? t('createOrderPage.editCard') : t('createOrderPage.addCard')}
              </p>
              <div className="flex flex-wrap gap-3">
                <input
                  value={cardForm.card_no}
                  onChange={(event) =>
                    setCardForm((current) => ({
                      ...current,
                      card_no: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder={t('createOrderPage.cardNo')}
                />
                <input
                  value={cardForm.name_on_card}
                  onChange={(event) =>
                    setCardForm((current) => ({
                      ...current,
                      name_on_card: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder={t('createOrderPage.nameOnCard')}
                />
                <input
                  value={cardForm.expire_month}
                  onChange={(event) =>
                    setCardForm((current) => ({
                      ...current,
                      expire_month: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.expireMonth')}
                />
                <input
                  value={cardForm.expire_year}
                  onChange={(event) =>
                    setCardForm((current) => ({
                      ...current,
                      expire_year: event.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm sm:w-[calc(50%-0.375rem)]"
                  placeholder={t('createOrderPage.expireYear')}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveCard}
                  disabled={cardSaving}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                >
                  {cardSaving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {editingCardId ? t('common.update') : t('common.save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCardFormOpen(false);
                    setEditingCardId(null);
                    setCardForm(emptyCardForm);
                  }}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-ink-700"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <label className="w-full text-sm font-medium text-ink-700 sm:w-[calc(50%-0.375rem)]">
              {t('createOrderPage.cardCvv')}
              <input
                value={cardCvv}
                onChange={(event) => setCardCvv(event.target.value.replace(/\D+/g, '').slice(0, 4))}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                placeholder={t('createOrderPage.cardCvv')}
              />
            </label>

            <label className="w-full text-sm font-medium text-ink-700 sm:w-[calc(50%-0.375rem)]">
              {t('createOrderPage.paymentOption')}
              <select
                value={installment}
                onChange={(event) => setInstallment(event.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              >
                {paymentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <aside className="rounded-xl border border-slate-200 p-4">
            <h3 className="font-display text-lg font-semibold text-ink-900">{t('common.orderSummary')}</h3>
            <div className="mt-3 space-y-1 text-sm text-ink-600">
              <div className="flex justify-between">
                <span>{t('common.productsTotal')}</span>
                <span>
                  {totals.productsTotal.toFixed(2)} {t('common.tl')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('common.shipping')}</span>
                <span>
                  {totals.shipping.toFixed(2)} {t('common.tl')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('common.discount')}</span>
                <span>
                  -{totals.discount.toFixed(2)} {t('common.tl')}
                </span>
              </div>
              <div className="my-2 border-t border-slate-200" />
              <div className="flex justify-between font-semibold text-ink-900">
                <span>{t('common.grandTotal')}</span>
                <span>
                  {totals.grandTotal.toFixed(2)} {t('common.tl')}
                </span>
              </div>
            </div>
          </aside>

          <div className="flex flex-wrap justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-ink-700"
            >
              {t('common.previous')}
            </button>
            <button
              type="button"
              onClick={handleCompleteOrder}
              disabled={orderSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
            >
              {orderSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {t('createOrderPage.completeOrder')}
            </button>
          </div>
        </div>
      )}

      <div className="text-xs text-ink-500">
        {language === 'tr'
          ? 'Not: Siparis olustururken secili (checked) urunler kullanilir.'
          : 'Note: Only checked products are included while creating an order.'}
      </div>
    </section>
  );
}

export default CreateOrderPage;
