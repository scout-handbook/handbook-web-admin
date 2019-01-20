"use strict";

interface CodeMirrorDoc {
	clearHistory(): void;
	replaceRange(value: string, cursor: [number, number]): void;
	getCursor(): [number, number];
}
