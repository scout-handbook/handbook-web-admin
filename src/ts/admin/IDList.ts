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

  public filter(filter: (key: string, value: T) => boolean): IDList<T> {
    const ret = new IDList<T>();
    this.iterate(function (key, value) {
      if (filter(key, value)) {
        ret.push(key, value);
      }
    });
    return ret;
  }

  public get(key: string): T | undefined {
    for (const item of this.list) {
      if (item.id === key) {
        return item.value;
      }
    }
    return undefined;
  }

  public push(key: string, value: T): void {
    this.list.push({ id: key, value });
  }

  public entries(): Array<[string, T]> {
    return this.list.map(({ id, value }) => [id, value]);
  }

  private iterate(iterator: (key: string, value: T) => void): void {
    for (const item of this.list) {
      iterator(item.id, item.value);
    }
  }
}
