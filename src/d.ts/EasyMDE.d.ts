declare class EasyMDE {
	public codemirror: CodeMirror;
	public constructor(options: object);
	public static toggleBold(): void;
	public static toggleItalic(): void;
	public static toggleHeadingSmaller(): void;
	public static toggleUnorderedList(): void;
	public static toggleOrderedList(): void;
	public static drawLink(): void;
	public static drawTable(): void;
	public value(): string;
	public value(value: string): void; // eslint-disable-line no-dupe-class-members
}
