export class IDList<T> {
  private readonly list: Array<{ id: string; value: T }>;

  public constructor(list: Record<string, T> = {}) {
    this.list = [];
    for (const key in list) {
      if (Object.prototype.hasOwnProperty.call(list, key)) {
        this.push(key, list[key]);
      }
    }
  }

  public map(transform: (value: T) => T): void {
    for (const item of this.list) {
      item.value = transform(item.value);
    }
  }

  public sort(comparator: (first: T, second: T) => number): void {
    this.list.sort(function (first, second): number {
      return comparator(first.value, second.value);
    });
  }

  public push(key: string, value: T): void {
    this.list.push({ id: key, value });
  }

  public entries(): Array<[string, T]> {
    return this.list.map(({ id, value }) => [id, value]);
  }
}
