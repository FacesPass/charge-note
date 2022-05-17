interface IStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export default abstract class Storage<T extends string> {
  private readonly storage: IStorage

  public constructor(getStorage = (): IStorage => window.localStorage) {
    this.storage = getStorage()
  }

  protected get(key: T): string | null {
    try {
      const data = this.storage.getItem(key)
      if (!data) {
        return null
      }
      return JSON.parse(data)
    } catch (e) {
      return null
    }
  }

  protected set(key: T, value: unknown): void {
    this.storage.setItem(key, JSON.stringify(value))
  }

  protected clearItem(key: T): void {
    this.storage.removeItem(key)
  }

  protected clearItems(keys: T[]): void {
    keys.forEach((key) => this.clearItem(key))
  }
}
