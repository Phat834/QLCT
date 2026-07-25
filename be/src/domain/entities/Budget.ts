export class Budget {
  private id: string;
  private categoryId: string;
  private limitAmount: number;
  private currentSpent: number;

  constructor(categoryId: string, limitAmount: number, currentSpent: number, id: string) {
    this.id = id;
    this.categoryId = categoryId;
    this.limitAmount = limitAmount;
    this.currentSpent = currentSpent;
  }

  public getId(): string {
    return this.id;
  }

  public getCategoryId(): string {
    return this.categoryId;
  }

  public getLimitAmount(): number {
    return this.limitAmount;
  }

  public getCurrentSpent(): number {
    return this.currentSpent;
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