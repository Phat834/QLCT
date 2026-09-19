export class Category {
  constructor(
    private id: string,
    private name: string,
    private icon: string,
    private createdAt: string = new Date().toISOString()
  ) {}

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getIcon(): string {
    return this.icon;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }
}