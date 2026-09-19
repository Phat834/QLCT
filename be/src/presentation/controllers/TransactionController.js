import { createExpenseSchema } from '../../application/validators/transactionValidators.js';
import { createIncomeSchema } from '../../application/validators/transactionValidators.js';
import { createTransferSchema } from '../../application/validators/transactionValidators.js';
export class TransactionController {
    createExpenseUseCase;
    createIncomeUseCase;
    createTransferUseCase;
    constructor(createExpenseUseCase, createIncomeUseCase, createTransferUseCase) {
        this.createExpenseUseCase = createExpenseUseCase;
        this.createIncomeUseCase = createIncomeUseCase;
        this.createTransferUseCase = createTransferUseCase;
    }
    async createExpense(req, res) {
        const parsed = createExpenseSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten().fieldErrors });
            return;
        }
        try {
            const result = await this.createExpenseUseCase.execute(parsed.data);
            res.status(201).json({ message: 'Tạo chi tiêu thành công!', data: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async createIncome(req, res) {
        const parsed = createIncomeSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten().fieldErrors });
            return;
        }
        try {
            const result = await this.createIncomeUseCase.execute(parsed.data);
            res.status(201).json({ message: 'Thêm thu nhập thành công!', data: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async createTransfer(req, res) {
        const parsed = createTransferSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.flatten().fieldErrors });
            return;
        }
        try {
            const result = await this.createTransferUseCase.execute(parsed.data);
            res.status(201).json({ message: 'Chuyển tiền thành công!', data: result });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=TransactionController.js.map