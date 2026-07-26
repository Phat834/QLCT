import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { Transaction } from '../../domain/entities/Transaction.js';
import { TransactionType } from '../../domain/enums/TransactionType.js';

export interface CreateExpenseDTO {
  id: string;
  walletId: string;
  categoryId: string;
  amount: number;
  note?: string | undefined;
}

export class CreateExpenseUseCase {
  constructor(
    private walletRepo: IWalletRepository,
    private categoryRepo: ICategoryRepository,
    private transactionRepo: ITransactionRepository
  ) {}
  async execute(dto: CreateExpenseDTO): Promise<void> {
    // 1. Kiểm tra Ví có tồn tại không
    const wallet = await this.walletRepo.findById(dto.walletId);
    if (!wallet) {
      throw new Error(`Không tìm thấy ví với ID: ${dto.walletId}`);
    }

    // 2. Kiểm tra Danh mục có tồn tại không
    const category = await this.categoryRepo.findById(dto.categoryId);
    if (!category) {
      throw new Error(`Không tìm thấy danh mục với ID: ${dto.categoryId}`);
    }

    // 3. Trừ số dư trong Ví (Nghiệp vụ chi tiêu)
    wallet.withdraw(dto.amount);

    // 4. Khởi tạo đối tượng Transaction
    const transaction = new Transaction(
      dto.id,
      dto.walletId,
      dto.amount,
      TransactionType.EXPENSE,
      dto.categoryId,
      undefined,
      dto.note,
      new Date()
    );

    // 5. Lưu cả Ví đã cập nhật số dư và Transaction mới vào DB
    await this.walletRepo.save(wallet);
    await this.transactionRepo.save(transaction);
  }
}