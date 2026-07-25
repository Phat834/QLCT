import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { Transaction } from '../../domain/entities/Transaction.js';
import { TransactionType } from '../../domain/enums/TransactionType.js';

export interface CreateTransferDTO {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  note?: string | undefined;
}

export class CreateTransferUseCase {
  constructor(
    private walletRepo: IWalletRepository,
    private transactionRepo: ITransactionRepository
  ) {}

  async execute(dto: CreateTransferDTO): Promise<Transaction> {
    if (dto.fromWalletId === dto.toWalletId) {
      throw new Error('Ví nguồn và ví đích không được trùng nhau!');
    }

    const fromWallet = await this.walletRepo.findById(dto.fromWalletId);
    const toWallet = await this.walletRepo.findById(dto.toWalletId);

    if (!fromWallet) throw new Error('Ví nguồn không tồn tại!');
    if (!toWallet) throw new Error('Ví đích không tồn tại!');

    fromWallet.withdraw(dto.amount);
    toWallet.deposit(dto.amount);

    const transaction = new Transaction(
      dto.id,
      dto.fromWalletId,
      dto.amount,
      TransactionType.TRANSFER,
      undefined,
      dto.toWalletId,
      new Date()
    );

    await this.walletRepo.save(fromWallet);
    await this.walletRepo.save(toWallet);
    await this.transactionRepo.save(transaction);

    return transaction;
  }
}
