export class Budget {
  private id: string;
  private categoryId: string;
  private walletIds: string[];
  private limitAmount: number;
  private currentSpent: number;
  private dueDate: string | null;
  private createdAt: string;
  private sortOrder: number;

  constructor(categoryId: string, walletIds: string[], limitAmount: number, currentSpent: number, id: string, dueDate: string | null = null, createdAt: string = new Date().toISOString(), sortOrder: number = 0) {
    this.id = id;
    this.categoryId = categoryId;
    this.walletIds = walletIds;
    this.limitAmount = limitAmount;
    this.currentSpent = currentSpent;
    this.dueDate = dueDate;
    this.createdAt = createdAt;
    this.sortOrder = sortOrder;
  }

  public getId(): string { return this.id; }
  public getCategoryId(): string { return this.categoryId; }
  public getWalletIds(): string[] { return this.walletIds; }
  public getLimitAmount(): number { return this.limitAmount; }
  public getCurrentSpent(): number { return this.currentSpent; }
  public getDueDate(): string | null { return this.dueDate; }
  public getCreatedAt(): string { return this.createdAt; }
  public getSortOrder(): number { return this.sortOrder; }
  public setSortOrder(order: number): void { this.sortOrder = order; }

  public addExpense(amount: number): void {
    this.currentSpent += amount;
  }

  public getStatus(): 'NORMAL' | 'WARNING_80' | 'EXCEEDED_100' {
    const percentage = (this.currentSpent / this.limitAmount) * 100;
    if (percentage >= 100) return 'EXCEEDED_100';
    if (percentage >= 80) return 'WARNING_80';
    return 'NORMAL';
  }

  public toJSON() {
    return {
      id: this.id,
      category_id: this.categoryId,
      wallet_ids: this.walletIds,
      limit_amount: this.limitAmount,
      current_spent: this.currentSpent,
      due_date: this.dueDate,
      created_at: this.createdAt,
      sort_order: this.sortOrder,
    };
  }
}
