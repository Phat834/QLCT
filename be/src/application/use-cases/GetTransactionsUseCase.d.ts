import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository.js';
export declare class GetTransactionsUseCase {
    private transactionRepo;
    constructor(transactionRepo: ITransactionRepository);
    execute(): Promise<import("../../domain/entities/Transaction.js").Transaction[]>;
}
//# sourceMappingURL=GetTransactionsUseCase.d.ts.map