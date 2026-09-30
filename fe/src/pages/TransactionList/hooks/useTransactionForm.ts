import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../../../services/api';
import { parseCurrency } from '../../../utils/currency';
import type { Transaction } from '../../../contexts/AppContext';

export type TransactionFormValues = {
  amount: string;
  type: Transaction['type'];
  walletId: string;
  fromWalletId: string;
  toWalletId: string;
  categoryId: string;
  note: string;
};

type UseTransactionFormProps = {
  refetch: () => Promise<void>;
};

export function useTransactionForm({ refetch }: UseTransactionFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<TransactionFormValues>({
    amount: '',
    type: 'EXPENSE',
    walletId: '',
    fromWalletId: '',
    toWalletId: '',
    categoryId: '',
    note: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setForm({
      amount: '',
      type: 'EXPENSE',
      walletId: '',
      fromWalletId: '',
      toWalletId: '',
      categoryId: '',
      note: '',
    });
    setFormError('');
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const updateForm = <K extends keyof TransactionFormValues>(
    field: K,
    value: TransactionFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateTransaction = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const id = 'tx_' + Math.random().toString(36).slice(2, 10);

      if (form.type === 'EXPENSE') {
        await api.createExpense({
          id,
          walletId: form.walletId,
          categoryId: form.categoryId,
          amount: parseCurrency(form.amount),
          note: form.note,
        });
      } else if (form.type === 'INCOME') {
        await api.createIncome({
          id,
          walletId: form.walletId,
          categoryId: form.categoryId || undefined,
          amount: parseCurrency(form.amount),
          note: form.note,
        });
      } else {
        await api.createTransfer({
          id,
          fromWalletId: form.fromWalletId,
          toWalletId: form.toWalletId,
          amount: parseCurrency(form.amount),
          note: form.note,
        });
      }

      resetForm();
      setShowModal(false);
      await refetch();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    showModal,
    openModal,
    closeModal,
    form,
    updateForm,
    submitting,
    formError,
    handleCreateTransaction,
  };
}
