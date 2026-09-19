import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
import { Transaction } from '../../domain/entities/Transaction.js';
export interface CreateTransferDTO {
    id: string;
    fromWalletId: string;
    toWalletId: string;
    amount: number;
    note?: string | undefined;
}
export declare class CreateTransferUseCase {
    private walletRepo;
    private transactionRepo;
    constructor(walletRepo: IWalletRepository, transactionRepo: ITransactionRepository);
    execute(dto: CreateTransferDTO): Promise<Transaction>;
}
//# sourceMappingURL=CreateTransferUseCase.d.ts.map