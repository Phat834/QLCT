// src/use-cases/CreateIncomeUseCase.ts
import { Transaction } from '../../domain/entities/Transaction.js';
import { TransactionType } from '../../domain/enums/TransactionType.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';

interface CreateIncomeDTO {
  id: string;
  walletId: string;
  categoryId: string;
  amount: number;
  note?: string | undefined;
}

export class CreateIncomeUseCase {
  constructor(
    private transactionRepo: ITransactionRepository,
    private walletRepo: IWalletRepository
  ) {}

  async execute(dto: CreateIncomeDTO): Promise<Transaction> {
    const wallet = await this.walletRepo.findById(dto.walletId);
    if (!wallet) throw new Error('Ví không tồn tại!');

    // Tăng số dư ví
    wallet.deposit(dto.amount);
    await this.walletRepo.update(wallet);

    // Tạo transaction với type INCOMING/INCOME
    const transaction = new Transaction(
      dto.id,
      dto.walletId,
      dto.amount,
      TransactionType.INCOME,
      dto.categoryId,
      undefined,
      new Date()
    );

    await this.transactionRepo.save(transaction);
    return transaction;
  }
}