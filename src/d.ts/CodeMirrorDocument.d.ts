declare class CodeMirrorDocument {
	public clearHistory(): void;
	public replaceRange(value: string, cursor: [number, number]): void;
	public getCursor(): [number, number];
}
