import { IWalletRepository } from '../../domain/repositories/IWalletRepository.js';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository.js';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
export interface CreateExpenseDTO {
    id: string;
    walletId: string;
    categoryId: string;
    amount: number;
    note?: string | undefined;
}
export declare class CreateExpenseUseCase {
    private walletRepo;
    private categoryRepo;
    private transactionRepo;
    constructor(walletRepo: IWalletRepository, categoryRepo: ICategoryRepository, transactionRepo: ITransactionRepository);
    execute(dto: CreateExpenseDTO): Promise<void>;
}
//# sourceMappingURL=CreateExpenseUseCase.d.ts.map