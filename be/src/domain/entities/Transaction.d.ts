import { TransactionType } from '../enums/TransactionType.js';
export declare class Transaction {
    private id;
    private walletId;
    private categoryId;
    private amount;
    private type;
    private targetWalletId;
    private note;
    private createdAt;
    constructor(id: string, walletId: string, amount: number, type: TransactionType, categoryId?: string, targetWalletId?: string, note?: string, createdAt?: Date);
    getId(): string;
    getAmount(): number;
    getType(): TransactionType;
    getWalletId(): string;
    getCategoryId(): string | undefined;
    getTargetWalletId(): string | undefined;
    getNote(): string | undefined;
    getCreatedAt(): Date;
}
//# sourceMappingURL=Transaction.d.ts.map