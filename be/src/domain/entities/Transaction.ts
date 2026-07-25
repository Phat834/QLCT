import { TransactionType } from '../enums/TransactionType.js';

export class Transaction {
  private id: string;
  private walletId: string;
  private categoryId: string | undefined;
  private amount: number;
  private type: TransactionType;
  private targetWalletId: string | undefined; // Dùng cho giao dịch TRANSFER
  private createdAt: Date;

  constructor(
    id: string,
    walletId: string,
    amount: number,
    type: TransactionType,
    categoryId?: string,
    targetWalletId?: string,
    createdAt?: Date
  ) {
    if (amount <= 0) throw new Error("Số tiền giao dịch phải lớn hơn 0");
    if (type === TransactionType.TRANSFER && !targetWalletId) {
      throw new Error("Giao dịch chuyển tiền phải có ví nhận");
    }

    this.id = id;
    this.walletId = walletId;
    this.amount = amount;
    this.type = type;
    this.categoryId = categoryId;
    this.targetWalletId = targetWalletId;
    this.createdAt = createdAt || new Date();
  }

  public getId(): string { return this.id; }
  public getAmount(): number { return this.amount; }
  public getType(): TransactionType { return this.type; }
  public getWalletId(): string { return this.walletId; }
  public getCategoryId(): string | undefined { return this.categoryId; }
  public getTargetWalletId(): string | undefined { return this.targetWalletId; }
  public getCreatedAt(): Date { return this.createdAt; }
}