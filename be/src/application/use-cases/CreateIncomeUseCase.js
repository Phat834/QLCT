// src/use-cases/CreateIncomeUseCase.ts
import { Transaction } from '../../domain/entities/Transaction.js';
import { TransactionType } from '../../domain/enums/TransactionType.js';
export class CreateIncomeUseCase {
    transactionRepo;
    walletRepo;
    constructor(transactionRepo, walletRepo) {
        this.transactionRepo = transactionRepo;
        this.walletRepo = walletRepo;
    }
    async execute(dto) {
        const wallet = await this.walletRepo.findById(dto.walletId);
        if (!wallet)
            throw new Error('Ví không tồn tại!');
        // Tăng số dư ví
        wallet.deposit(dto.amount);
        await this.walletRepo.update(wallet);
        // Tạo transaction với type INCOMING/INCOME
        const transaction = new Transaction(dto.id, dto.walletId, dto.amount, TransactionType.INCOME, dto.categoryId, undefined, dto.note, new Date());
        await this.transactionRepo.save(transaction);
        return transaction;
    }
}
//# sourceMappingURL=CreateIncomeUseCase.js.map