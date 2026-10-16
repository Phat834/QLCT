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
  async handleWebhookExpense(req: Request, res: Response): Promise<void> {
    try {
      const { text, appName, walletId, categoryId } = req.body;
      // Ví dụ text: "Số dư TK VCB ... -10,000 VND lúc 16/10/2026. ND: mua chai nuoc"

      if (!text || !walletId || !categoryId) {
        res.status(400).json({ 
          error: 'Thiếu thông tin bắt buộc: text, walletId hoặc categoryId' 
        });
        return;
      }

      // 1. Dùng Regex tách số tiền bị trừ (hỗ trợ cả thông báo Ngân hàng và MoMo)
      // Bắt các định dạng: "-10,000 VND", "-10.000đ", "Thanh toán 10.000đ", "vừa trả 10,000đ"
      const amountMatch = text.match(/(?:-|\bthanh toán\b|\bchuyển\b|\btrả\b|\btrừ\b)\s*([\d.,]+)\s*(?:VND|đ|d|vnđ)/i);

      if (!amountMatch) {
        // Nếu là thông báo quảng cáo hoặc cộng tiền thì bỏ qua, trả về 200 để app điện thoại không báo lỗi
        res.status(200).json({ message: 'Không phát hiện giao dịch trừ tiền, bỏ qua.' });
        return;
      }

      // Làm sạch dấu chấm/phẩy để lấy số nguyên (VD: "10,000" -> 10000)
      const amount = Number(amountMatch[1].replace(/[.,]/g, ''));

      // 2. Tách nội dung: Ưu tiên bắt sau chữ ND / Nội dung / Lời nhắn
      // Nếu không có lời nhắn thì tự bắt tên người nhận/cửa hàng (sau chữ "cho " hoặc "tại ")
      const noteMatch = text.match(/\b(?:ND|Nội dung|Lời nhắn|Mô tả)\s*[:\-]\s*([^.\n]+)/i)
        || text.match(/\b(?:thanh toán|chuyển tiền).*?\b(?:cho|tại|đến)\s+([^.\n(]+)/i);

      const note = noteMatch
        ? noteMatch[1].trim()
        : `Quét QR (${appName || 'Tự động'}): ${text.slice(0, 50)}`;

      // 3. Tự sinh mã id cho giao dịch (giống chuẩn id trên Supabase của bạn)
      const generatedId = `tx_${Math.random().toString(36).substring(2, 10)}`;

      // Đưa đầy đủ id, walletId, categoryId, amount, note qua createExpenseSchema
      const parsed = createExpenseSchema.safeParse({
        id: generatedId,
        walletId,
        categoryId,
        amount,
        note
      });

      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten().fieldErrors });
        return;
      }

      // 4. Thực thi UseCase trừ tiền ví và lưu giao dịch vào Supabase
      const result = await this.createExpenseUseCase.execute(parsed.data);
      res.status(201).json({ 
        message: 'Tự động ghi nhận chi tiêu QR thành công!', 
        data: result 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

