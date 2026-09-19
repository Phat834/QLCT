import { z } from 'zod';
export declare const createExpenseSchema: z.ZodObject<{
    id: z.ZodString;
    walletId: z.ZodString;
    categoryId: z.ZodString;
    amount: z.ZodNumber;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createIncomeSchema: z.ZodObject<{
    id: z.ZodString;
    walletId: z.ZodString;
    categoryId: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createTransferSchema: z.ZodObject<{
    id: z.ZodString;
    fromWalletId: z.ZodString;
    toWalletId: z.ZodString;
    amount: z.ZodNumber;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createBudgetSchema: z.ZodObject<{
    id: z.ZodString;
    categoryId: z.ZodString;
    walletIds: z.ZodArray<z.ZodString>;
    limitAmount: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=transactionValidators.d.ts.map