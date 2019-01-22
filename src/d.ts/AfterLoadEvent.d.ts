declare class AfterLoadEvent {
	public constructor(threshold: number);
	public addCallback(callback: (...args: Array<string>) => void): void;
	public trigger(...args: Array<string>): void;
}
