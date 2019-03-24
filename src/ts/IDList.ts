interface IDListItems<T>
{
	[key: string]: T;
}

class IDList<T>
{
	private list: IDListItems<T>;

	public constructor(list: IDListItems<T> = {})
	{
		this.list = list;
	}

	public iterate(iterator: (key: string, value: T) => void): void
	{
		for (var key in this.list) {
			if (this.list.hasOwnProperty(key)) {
				iterator(key, this.list[key]);
			}
		}
	}

	public get(key: string): T
	{
		return this.list[key];
	}
}
