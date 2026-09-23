import { WalletType } from '../enums/WalletType.js';

export class Wallet {
  private id: string;
  private name: string;
  private balance: number;
  private createdAt: Date;
  private type: WalletType;

  constructor(
    id: string,
    name: string,
    initialBalance: number,
    createdAt?: Date,
    type: WalletType = WalletType.AVAILABLE
  ) {
    this.id = id;
    this.name = name;
    this.balance = initialBalance;
    this.createdAt = createdAt || new Date();
    this.type = type;
  }

  // --- GETTERS ---
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getBalance(): number {
    return this.balance;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getType(): WalletType {
    return this.type;
  }

  // --- DOMAIN BUSINESS LOGIC ---
  public deposit(amount: number): void {
    if (amount <= 0) throw new Error("Số tiền nạp phải lớn hơn 0");
    this.balance += amount;
  }

  public withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Số tiền rút phải lớn hơn 0");
    if (amount > this.balance) throw new Error("Số dư không đủ");
    this.balance -= amount;
  }
}