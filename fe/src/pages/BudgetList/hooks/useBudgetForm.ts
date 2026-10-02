import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../../../services/api';
import { formatCurrency, parseCurrency } from '../../../utils/currency';
import type { Budget, Category, Wallet } from '../../../contexts/AppContext';
import type { BudgetFormValues } from '../utils/budgetUtils';

type UseBudgetFormProps = {
  categories: Category[];
  wallets: Wallet[];
  refetch: () => Promise<void>;
};

const emptyForm: BudgetFormValues = {
  categoryId: '',
  walletIds: [],
  limitAmount: '',
  dueDate: '',
};

export function useBudgetForm({ categories, wallets, refetch }: UseBudgetFormProps) {
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BudgetFormValues>(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string }>({ open: false, id: '' });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };
  const openAdd = () => {
    if (wallets.length === 0) {
      setShowWarning(true);
      return;
    }
    resetForm();
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };
  const closeWarning = () => setShowWarning(false);
  const updateForm = <K extends keyof BudgetFormValues>(
    field: K,
    value: BudgetFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const body = editingId
      ? {
          categoryId: form.categoryId,
          walletIds: form.walletIds,
          limitAmount: parseCurrency(form.limitAmount),
          dueDate: form.dueDate || null,
        }
      : {
          id: 'budget_' + Math.random().toString(36).slice(2, 10),
          categoryId: form.categoryId,
          walletIds: form.walletIds,
          limitAmount: parseCurrency(form.limitAmount),
          dueDate: form.dueDate || null,
        };

    try {
      if (editingId) {
        await api.updateBudget(editingId, body);
      } else {
        await api.createBudget(body);
      }
      resetForm();
      setShowModal(false);
      await refetch();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const openDeleteConfirm = (id: string) => {
    setDeleteConfirm({ open: true, id });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ open: false, id: '' });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    if (!id) return;
    closeDeleteConfirm();
    try {
      await api.deleteBudget(id);
      await refetch();
    } catch (err: any) {
      setError(err.message);
    }
  };
  const startEdit = (budget: Budget) => {
    setEditingId(budget.id);
    setForm({
      categoryId: budget.categoryId,
      walletIds: budget.walletIds || [],
      limitAmount: formatCurrency(String(budget.limitAmount)),
      dueDate: budget.dueDate ? budget.dueDate.split('T')[0] : '',
    });
    setError('');
    setShowModal(true);
  };

  return {
    categories,
    showModal,
    showWarning,
    editingId,
    form,
    error,
    loading,
    openAdd,
    closeModal,
    closeWarning,
    updateForm,
    handleSubmit,
    handleDelete: openDeleteConfirm,
    startEdit,
    deleteConfirm,
    closeDeleteConfirm,
    handleDeleteConfirm,
  };
}
