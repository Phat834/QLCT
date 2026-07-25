import { Request, Response } from 'express';
import { GetTransactionsUseCase } from '../../application/use-cases/GetTransactionsUseCase.js';
import { GetWalletsUseCase } from '../../application/use-cases/GetWalletsUseCase.js';
import { GetCategoriesUseCase } from '../../application/use-cases/GetCategoriesUseCase.js';
import { GetBudgetsUseCase } from '../../application/use-cases/GetBudgetsUseCase.js';
import { GetBudgetByCategoryUseCase } from '../../application/use-cases/GetBudgetByCategoryUseCase.js';

export class ApiController {
  constructor(
    private getTransactionsUseCase: GetTransactionsUseCase,
    private getWalletsUseCase: GetWalletsUseCase,
    private getCategoriesUseCase: GetCategoriesUseCase,
    private getBudgetsUseCase: GetBudgetsUseCase,
    private getBudgetByCategoryUseCase: GetBudgetByCategoryUseCase
  ) {}

  async getTransactions(_req: Request, res: Response): Promise<void> {
    const list = await this.getTransactionsUseCase.execute();
    res.json(list);
  }

  async getWallets(_req: Request, res: Response): Promise<void> {
    const wallets = await this.getWalletsUseCase.execute();
    res.json(wallets);
  }

  async getCategories(_req: Request, res: Response): Promise<void> {
    const categories = await this.getCategoriesUseCase.execute();
    res.json(categories);
  }

  async getBudgets(_req: Request, res: Response): Promise<void> {
    const budgets = await this.getBudgetsUseCase.execute();
    res.json(budgets);
  }

  async getBudgetByCategory(req: Request, res: Response): Promise<void> {
    const categoryId = req.params.categoryId;
    if (!categoryId || Array.isArray(categoryId)) {
      res.status(400).json({ error: 'Thiếu categoryId' });
      return;
    }

    const budget = await this.getBudgetByCategoryUseCase.execute({ categoryId });
    res.json(budget);
  }
}
