import { Request, Response } from 'express';
import { CreateExpenseUseCase } from '../../application/use-cases/CreateExpenseUseCase.js';
import { CreateIncomeUseCase } from '../../application/use-cases/CreateIncomeUseCase.js';
import { CreateTransferUseCase } from '../../application/use-cases/CreateTransferUseCase.js';
import { createExpenseSchema } from '../../application/validators/transactionValidators.js';
import { createIncomeSchema } from '../../application/validators/transactionValidators.js';
import { createTransferSchema } from '../../application/validators/transactionValidators.js';

export class TransactionController {
  constructor(
    private createExpenseUseCase: CreateExpenseUseCase,
    private createIncomeUseCase: CreateIncomeUseCase,
    private createTransferUseCase: CreateTransferUseCase
  ) {}

  async createExpense(req: Request, res: Response): Promise<void> {
    const parsed = createExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    try {
      const result = await this.createExpenseUseCase.execute(parsed.data);
      res.status(201).json({ message: 'Tạo chi tiêu thành công!', data: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createIncome(req: Request, res: Response): Promise<void> {
    const parsed = createIncomeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    try {
      const result = await this.createIncomeUseCase.execute(parsed.data);
      res.status(201).json({ message: 'Thêm thu nhập thành công!', data: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createTransfer(req: Request, res: Response): Promise<void> {
    const parsed = createTransferSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    try {
      const result = await this.createTransferUseCase.execute(parsed.data);
      res.status(201).json({ message: 'Chuyển tiền thành công!', data: result });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
