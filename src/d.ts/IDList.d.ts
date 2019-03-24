declare class IDList<T>
{
	public constructor(list: IDListItems<T>);
	public iterate(iterator: (key: string, value: T) => void): void;
	public empty(): boolean;
	public get(key: string): T;
}
