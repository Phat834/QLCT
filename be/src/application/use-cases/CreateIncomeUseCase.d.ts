import { Transaction } from '../../domain/entities/Transaction.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
interface CreateIncomeDTO {
    id: string;
    walletId: string;
    categoryId?: string | undefined;
    amount: number;
    note?: string | undefined;
}
export declare class CreateIncomeUseCase {
    private transactionRepo;
    private walletRepo;
    constructor(transactionRepo: ITransactionRepository, walletRepo: IWalletRepository);
    execute(dto: CreateIncomeDTO): Promise<Transaction>;
}
export {};
//# sourceMappingURL=CreateIncomeUseCase.d.ts.map