import { WalletType } from '../enums/WalletType.js';
export declare class Wallet {
    private id;
    private name;
    private balance;
    private createdAt;
    private type;
    constructor(id: string, name: string, initialBalance: number, createdAt?: Date, type?: WalletType);
    getId(): string;
    getName(): string;
    getBalance(): number;
    getCreatedAt(): Date;
    getType(): WalletType;
    deposit(amount: number): void;
    withdraw(amount: number): void;
}
//# sourceMappingURL=Wallet.d.ts.map