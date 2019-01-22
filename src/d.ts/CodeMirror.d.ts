declare class CodeMirror {
	public getDoc(): CodeMirrorDocument;
	public on(event: string, callback: () => void): void;
}
