import { WalletType } from '../enums/WalletType.js';
export class Wallet {
    id;
    name;
    balance;
    createdAt;
    type;
    constructor(id, name, initialBalance, createdAt, type = WalletType.AVAILABLE) {
        if (initialBalance < 0) {
            throw new Error("Số dư ban đầu không được âm");
        }
        this.id = id;
        this.name = name;
        this.balance = initialBalance;
        this.createdAt = createdAt || new Date();
        this.type = type;
    }
    // --- GETTERS ---
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getBalance() {
        return this.balance;
    }
    getCreatedAt() {
        return this.createdAt;
    }
    getType() {
        return this.type;
    }
    // --- DOMAIN BUSINESS LOGIC ---
    deposit(amount) {
        if (amount <= 0)
            throw new Error("Số tiền nạp phải lớn hơn 0");
        this.balance += amount;
    }
    withdraw(amount) {
        if (amount <= 0)
            throw new Error("Số tiền rút phải lớn hơn 0");
        if (amount > this.balance)
            throw new Error("Số dư không đủ");
        this.balance -= amount;
    }
}
//# sourceMappingURL=Wallet.js.map