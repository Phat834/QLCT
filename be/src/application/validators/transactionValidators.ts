import { z } from 'zod';

export const createExpenseSchema = z.object({
  id: z.string().min(1, 'Thiếu id'),
  walletId: z.string().min(1, 'Thiếu ví'),
  categoryId: z.string().min(1, 'Thiếu danh mục'),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  note: z.string().optional(),
});

export const createIncomeSchema = z.object({
  id: z.string().min(1, 'Thiếu id'),
  walletId: z.string().min(1, 'Thiếu ví'),
  categoryId: z.string().optional(),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  note: z.string().optional(),
});

export const createTransferSchema = z.object({
  id: z.string().min(1, 'Thiếu id'),
  fromWalletId: z.string().min(1, 'Thiếu ví nguồn'),
  toWalletId: z.string().min(1, 'Thiếu ví đích'),
  amount: z.number().positive('Số tiền chuyển phải lớn hơn 0'),
  note: z.string().optional(),
});

export const createBudgetSchema = z.object({
  id: z.string().min(1, 'Thiếu id'),
  categoryId: z.string().min(1, 'Thiếu danh mục'),
  walletIds: z.array(z.string()).min(1, 'Chọn ít nhất 1 ví'),
  limitAmount: z.number().positive('Hạn mức phải lớn hơn 0'),
});
