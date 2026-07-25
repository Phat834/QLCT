import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController.js';
import { CreateExpenseUseCase } from '../../application/use-cases/CreateExpenseUseCase.js';
import { CreateIncomeUseCase } from '../../application/use-cases/CreateIncomeUseCase.js';
import { CreateTransferUseCase } from '../../application/use-cases/CreateTransferUseCase.js';
import { SupabaseWalletRepository } from '../../infrastructure/database/SupabaseWalletRepository.js';
import { SupabaseCategoryRepository } from '../../infrastructure/database/SupabaseCategoryRepository.js';
import { SupabaseTransactionRepository } from '../../infrastructure/database/SupabaseTransactionRepository.js';

export const createTransactionRouter = () => {
  const router = Router();

  const walletRepo = new SupabaseWalletRepository();
  const categoryRepo = new SupabaseCategoryRepository();
  const transactionRepo = new SupabaseTransactionRepository();

  const createExpenseUseCase = new CreateExpenseUseCase(walletRepo, categoryRepo, transactionRepo);
  const createIncomeUseCase = new CreateIncomeUseCase(transactionRepo, walletRepo);
  const createTransferUseCase = new CreateTransferUseCase(walletRepo, transactionRepo);
  const transactionController = new TransactionController(createExpenseUseCase, createIncomeUseCase, createTransferUseCase);

  router.post('/expense', (req, res) => transactionController.createExpense(req, res));
  router.post('/income', (req, res) => transactionController.createIncome(req, res));
  router.post('/transfer', (req, res) => transactionController.createTransfer(req, res));

  return router;
};
