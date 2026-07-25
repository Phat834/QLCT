export class Category {
  constructor(
    private id: string,
    private name: string,
    private icon: string
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
}