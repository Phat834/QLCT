import { Request, Response } from 'express';
import { CreateCategoryUseCase } from '../../application/use-cases/CreateCategoryUseCase.js';
import { UpdateCategoryUseCase } from '../../application/use-cases/UpdateCategoryUseCase.js';
import { DeleteCategoryUseCase } from '../../application/use-cases/DeleteCategoryUseCase.js';
import { CreateBudgetUseCase } from '../../application/use-cases/CreateBudgetUseCase.js';
import { UpdateBudgetUseCase } from '../../application/use-cases/UpdateBudgetUseCase.js';
import { DeleteBudgetUseCase } from '../../application/use-cases/DeleteBudgetUseCase.js';
import { GetBudgetByCategoryUseCase } from '../../application/use-cases/GetBudgetByCategoryUseCase.js';
import { GetBudgetsUseCase } from '../../application/use-cases/GetBudgetsUseCase.js';
import { GetCategoriesUseCase } from '../../application/use-cases/GetCategoriesUseCase.js';
import { GetTransactionsUseCase } from '../../application/use-cases/GetTransactionsUseCase.js';
import { GetWalletsUseCase } from '../../application/use-cases/GetWalletsUseCase.js';
export declare class ApiController {
    private getTransactionsUseCase;
    private getWalletsUseCase;
    private getCategoriesUseCase;
    private getBudgetsUseCase;
    private getBudgetByCategoryUseCase;
    private createCategoryUseCase;
    private updateCategoryUseCase;
    private deleteCategoryUseCase;
    private createBudgetUseCase;
    private updateBudgetUseCase;
    private deleteBudgetUseCase;
    constructor(getTransactionsUseCase: GetTransactionsUseCase, getWalletsUseCase: GetWalletsUseCase, getCategoriesUseCase: GetCategoriesUseCase, getBudgetsUseCase: GetBudgetsUseCase, getBudgetByCategoryUseCase: GetBudgetByCategoryUseCase, createCategoryUseCase: CreateCategoryUseCase, updateCategoryUseCase: UpdateCategoryUseCase, deleteCategoryUseCase: DeleteCategoryUseCase, createBudgetUseCase: CreateBudgetUseCase, updateBudgetUseCase: UpdateBudgetUseCase, deleteBudgetUseCase: DeleteBudgetUseCase);
    getTransactions(_req: Request, res: Response): Promise<void>;
    getWallets(_req: Request, res: Response): Promise<void>;
    getCategories(_req: Request, res: Response): Promise<void>;
    createCategory(req: Request, res: Response): Promise<void>;
    updateCategory(req: Request, res: Response): Promise<void>;
    deleteCategory(req: Request, res: Response): Promise<void>;
    createBudget(req: Request, res: Response): Promise<void>;
    updateBudget(req: Request, res: Response): Promise<void>;
    deleteBudget(req: Request, res: Response): Promise<void>;
    getBudgets(_req: Request, res: Response): Promise<void>;
    getBudgetByCategory(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ApiController.d.ts.map