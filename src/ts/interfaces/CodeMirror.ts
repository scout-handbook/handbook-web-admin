"use strict";

interface CodeMirror {
	getDoc(): CodeMirrorDoc;
	on(event: string, callback: () => void): void;
}
