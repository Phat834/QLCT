import { WalletType } from '../enums/WalletType.js';

export class Wallet {
  private id: string;
  private name: string;
  private balance: number;
  private createdAt: Date;
  private type: WalletType;
  private sortOrder: number;

  constructor(
    id: string,
    name: string,
    initialBalance: number,
    createdAt?: Date,
    type: WalletType = WalletType.AVAILABLE,
    sortOrder: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.balance = initialBalance;
    this.createdAt = createdAt || new Date();
    this.type = type;
    this.sortOrder = sortOrder;
  }

  public getId(): string { return this.id; }
  public getName(): string { return this.name; }
  public getBalance(): number { return this.balance; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getType(): WalletType { return this.type; }
  public getSortOrder(): number { return this.sortOrder; }
  public setSortOrder(order: number): void { this.sortOrder = order; }

  public deposit(amount: number): void {
    if (amount <= 0) throw new Error("Số tiền nạp phải lớn hơn 0");
    this.balance += amount;
  }

  public withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Số tiền rút phải lớn hơn 0");
    if (amount > this.balance) throw new Error("Số dư không đủ");
    this.balance -= amount;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      balance: this.balance,
      created_at: this.createdAt.toISOString(),
      type: this.type,
      sort_order: this.sortOrder,
    };
  }
}