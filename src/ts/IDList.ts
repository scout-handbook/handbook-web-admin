/* exported IDList */

class IDList<T>
{
	private list: IDListItems<T>;

	public constructor(list: IDListItems<T> = {})
	{
		this.list = list;
	}

	public iterate(iterator: (key: string, value: T) => void): void
	{
		for (const key in this.list) {
			if (Object.prototype.hasOwnProperty.call(this.list, key)) {
				iterator(key, this.list[key]);
			}
		}
	}

	public empty(): boolean
	{
		let ret = true;
		this.iterate(function()
		{
			ret = false;
		});
		return ret;
	}

	public get(key: string): T
	{
		return this.list[key];
	}
}
