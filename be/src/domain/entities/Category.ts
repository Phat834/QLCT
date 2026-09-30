export class Category {
  constructor(
    private id: string,
    private name: string,
    private icon: string,
    private createdAt: string = new Date().toISOString(),
    private sortOrder: number = 0
  ) {}

  public getId(): string { return this.id; }
  public getName(): string { return this.name; }
  public getIcon(): string { return this.icon; }
  public getCreatedAt(): string { return this.createdAt; }
  public getSortOrder(): number { return this.sortOrder; }
  public setSortOrder(order: number): void { this.sortOrder = order; }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      created_at: this.createdAt,
      sort_order: this.sortOrder,
    };
  }
}