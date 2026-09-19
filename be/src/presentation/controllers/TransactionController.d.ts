import { Request, Response } from 'express';
import { CreateExpenseUseCase } from '../../application/use-cases/CreateExpenseUseCase.js';
import { CreateIncomeUseCase } from '../../application/use-cases/CreateIncomeUseCase.js';
import { CreateTransferUseCase } from '../../application/use-cases/CreateTransferUseCase.js';
export declare class TransactionController {
    private createExpenseUseCase;
    private createIncomeUseCase;
    private createTransferUseCase;
    constructor(createExpenseUseCase: CreateExpenseUseCase, createIncomeUseCase: CreateIncomeUseCase, createTransferUseCase: CreateTransferUseCase);
    createExpense(req: Request, res: Response): Promise<void>;
    createIncome(req: Request, res: Response): Promise<void>;
    createTransfer(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=TransactionController.d.ts.map