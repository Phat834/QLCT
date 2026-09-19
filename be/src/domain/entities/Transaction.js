import { TransactionType } from '../enums/TransactionType.js';
export class Transaction {
    id;
    walletId;
    categoryId;
    amount;
    type;
    targetWalletId;
    note;
    createdAt;
    constructor(id, walletId, amount, type, categoryId, targetWalletId, note, createdAt) {
        if (amount <= 0)
            throw new Error("Số tiền giao dịch phải lớn hơn 0");
        if (type === TransactionType.TRANSFER && !targetWalletId) {
            throw new Error("Giao dịch chuyển tiền phải có ví nhận");
        }
        this.id = id;
        this.walletId = walletId;
        this.amount = amount;
        this.type = type;
        this.categoryId = categoryId;
        this.targetWalletId = targetWalletId;
        this.note = note;
        this.createdAt = createdAt || new Date();
    }
    getId() { return this.id; }
    getAmount() { return this.amount; }
    getType() { return this.type; }
    getWalletId() { return this.walletId; }
    getCategoryId() { return this.categoryId; }
    getTargetWalletId() { return this.targetWalletId; }
    getNote() { return this.note; }
    getCreatedAt() { return this.createdAt; }
}
//# sourceMappingURL=Transaction.js.map