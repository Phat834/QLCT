export class Budget {
  private id: string;
  private categoryId: string;
  private walletId: string;
  private limitAmount: number;
  private currentSpent: number;
  private dueDate: string | null;

  constructor(categoryId: string, walletId: string, limitAmount: number, currentSpent: number, id: string, dueDate: string | null = null) {
    this.id = id;
    this.categoryId = categoryId;
    this.walletId = walletId;
    this.limitAmount = limitAmount;
    this.currentSpent = currentSpent;
    this.dueDate = dueDate;
  }

  public getId(): string {
    return this.id;
  }

  public getCategoryId(): string {
    return this.categoryId;
  }

  public getWalletId(): string {
    return this.walletId;
  }

  public getLimitAmount(): number {
    return this.limitAmount;
  }

  public getCurrentSpent(): number {
    return this.currentSpent;
  }

  public getDueDate(): string | null {
    return this.dueDate;
  }

  public addExpense(amount: number): void {
    this.currentSpent += amount;
  }

  public getStatus(): 'NORMAL' | 'WARNING_80' | 'EXCEEDED_100' {
    const percentage = (this.currentSpent / this.limitAmount) * 100;
    if (percentage >= 100) return 'EXCEEDED_100';
    if (percentage >= 80) return 'WARNING_80';
    return 'NORMAL';
  }
}