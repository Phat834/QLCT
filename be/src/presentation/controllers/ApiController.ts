import { Request, Response } from 'express';
import { CreateCategoryUseCase } from '../../application/use-cases/CreateCategoryUseCase.js';
import { UpdateCategoryUseCase } from '../../application/use-cases/UpdateCategoryUseCase.js';
import { DeleteCategoryUseCase } from '../../application/use-cases/DeleteCategoryUseCase.js';
import { CreateBudgetUseCase } from '../../application/use-cases/CreateBudgetUseCase.js';
import { UpdateBudgetUseCase } from '../../application/use-cases/UpdateBudgetUseCase.js';
import { DeleteBudgetUseCase } from '../../application/use-cases/DeleteBudgetUseCase.js';
import { CreateWalletUseCase } from '../../application/use-cases/CreateWalletUseCase.js';
import { GetBudgetByCategoryUseCase } from '../../application/use-cases/GetBudgetByCategoryUseCase.js';
import { GetBudgetsUseCase } from '../../application/use-cases/GetBudgetsUseCase.js';
import { GetCategoriesUseCase } from '../../application/use-cases/GetCategoriesUseCase.js';
import { GetTransactionsUseCase } from '../../application/use-cases/GetTransactionsUseCase.js';
import { GetWalletsUseCase } from '../../application/use-cases/GetWalletsUseCase.js';

export class ApiController {
  constructor(
    private getTransactionsUseCase: GetTransactionsUseCase,
    private getWalletsUseCase: GetWalletsUseCase,
    private getCategoriesUseCase: GetCategoriesUseCase,
    private getBudgetsUseCase: GetBudgetsUseCase,
    private getBudgetByCategoryUseCase: GetBudgetByCategoryUseCase,
    private createCategoryUseCase: CreateCategoryUseCase,
    private updateCategoryUseCase: UpdateCategoryUseCase,
    private deleteCategoryUseCase: DeleteCategoryUseCase,
    private createBudgetUseCase: CreateBudgetUseCase,
    private updateBudgetUseCase: UpdateBudgetUseCase,
    private deleteBudgetUseCase: DeleteBudgetUseCase
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

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id, name, icon } = req.body;
      if (!id || !name) {
        res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
        return;
      }
      const category = await this.createCategoryUseCase.execute({ id, name, icon: icon || 'default-icon' });
      res.status(201).json({ message: 'Tạo danh mục thành công!', data: category });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { name, icon } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Thiếu tên danh mục!' });
        return;
      }
      const category = await this.updateCategoryUseCase.execute({ id, name, icon: icon || 'default-icon' });
      res.status(200).json({ message: 'Cập nhật danh mục thành công!', data: category });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      if (!id) {
        res.status(400).json({ error: 'Thiếu ID danh mục!' });
        return;
      }
      await this.deleteCategoryUseCase.execute(id);
      res.status(200).json({ message: 'Xoá danh mục thành công!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createBudget(req: Request, res: Response): Promise<void> {
    try {
      const { id, categoryId, walletIds, limitAmount, dueDate } = req.body;
      if (!id || !categoryId || !walletIds || !Array.isArray(walletIds) || walletIds.length === 0 || limitAmount === undefined) {
        res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
        return;
      }
      const budget = await this.createBudgetUseCase.execute({ id, categoryId, walletIds, limitAmount: Number(limitAmount), dueDate: dueDate ?? null });
      res.status(201).json({ message: 'Tạo ngân sách thành công!', data: budget });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateBudget(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const { categoryId, walletIds, limitAmount, dueDate } = req.body;
      if (!id || !categoryId || !walletIds || !Array.isArray(walletIds) || walletIds.length === 0 || limitAmount === undefined) {
        res.status(400).json({ error: 'Thiếu thông tin bắt buộc!' });
        return;
      }
      const budget = await this.updateBudgetUseCase.execute({ id, categoryId, walletIds: walletIds || undefined, limitAmount: Number(limitAmount), dueDate: dueDate ?? null });
      res.status(200).json({ message: 'Cập nhật ngân sách thành công!', data: budget });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteBudget(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      if (!id) {
        res.status(400).json({ error: 'Thiếu ID ngân sách!' });
        return;
      }
      await this.deleteBudgetUseCase.execute(id);
      res.status(200).json({ message: 'Xoá ngân sách thành công!' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
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
