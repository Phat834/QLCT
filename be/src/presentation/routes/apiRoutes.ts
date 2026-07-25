import { Router } from 'express';
import { ApiController } from '../controllers/ApiController.js';
import { WalletController } from '../controllers/WalletController.js';
import { GetTransactionsUseCase } from '../../application/use-cases/GetTransactionsUseCase.js';
import { GetWalletsUseCase } from '../../application/use-cases/GetWalletsUseCase.js';
import { GetCategoriesUseCase } from '../../application/use-cases/GetCategoriesUseCase.js';
import { GetBudgetsUseCase } from '../../application/use-cases/GetBudgetsUseCase.js';
import { GetBudgetByCategoryUseCase } from '../../application/use-cases/GetBudgetByCategoryUseCase.js';
import { CreateWalletUseCase } from '../../application/use-cases/CreateWalletUseCase.js';
import { SupabaseTransactionRepository } from '../../infrastructure/database/SupabaseTransactionRepository.js';
import { SupabaseWalletRepository } from '../../infrastructure/database/SupabaseWalletRepository.js';
import { SupabaseCategoryRepository } from '../../infrastructure/database/SupabaseCategoryRepository.js';
import { SupabaseBudgetRepository } from '../../infrastructure/database/SupabaseBudgetRepository.js';
import { createTransactionRouter } from './transactionRoutes.js';

export const createApiRouter = () => {
  const router = Router();

  const transactionRepo = new SupabaseTransactionRepository();
  const walletRepo = new SupabaseWalletRepository();
  const categoryRepo = new SupabaseCategoryRepository();
  const budgetRepo = new SupabaseBudgetRepository();

  const apiController = new ApiController(
    new GetTransactionsUseCase(transactionRepo),
    new GetWalletsUseCase(walletRepo),
    new GetCategoriesUseCase(categoryRepo),
    new GetBudgetsUseCase(budgetRepo),
    new GetBudgetByCategoryUseCase(budgetRepo)
  );

  const walletController = new WalletController();

  router.use('/transactions', createTransactionRouter());
  router.get('/transactions/all', (req, res) => apiController.getTransactions(req, res));
  router.get('/wallets', (req, res) => apiController.getWallets(req, res));
  router.post('/wallets', (req, res) => walletController.createWallet(req, res));
  router.get('/categories', (req, res) => apiController.getCategories(req, res));
  router.get('/budgets', (req, res) => apiController.getBudgets(req, res));
  router.get('/budgets/category/:categoryId', (req, res) => apiController.getBudgetByCategory(req, res));

  return router;
};
