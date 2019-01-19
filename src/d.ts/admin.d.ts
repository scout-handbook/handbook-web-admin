/* eslint strict: "off", no-unused-vars: "off" */

declare var COMPETENCES: any;
declare var CONFIG: any;
declare var FIELDS: any;
declare var GROUPS: any;
declare var LOGINSTATE: any;
declare var authFailHandler: any;
declare var mainPageTab: any;
declare var metadataEvent: any;
declare var reAuthHandler: any;
declare function refreshLogin(...a: any): any;
declare function refreshMetadata(...a: any): any;
declare function refreshPreview(...a: any): any;
declare function request(...a: any): any;

declare class Action {
	public callback: (response: RequestResponse) => void;
	public constructor(url: string, method: string, payloadBuilder?: () => Payload, callback?: (response: RequestResponse) => void, exceptionHandler?: ExceptionHandler);
}

declare class ActionQueue {
	public actions: Array<Action>;
	public constructor(actions?: Array<Action>, retry?: boolean);
	public fillID(id: string): void;
	public dispatch(background: boolean): void;
	public defaultDispatch(background: boolean): void;
	public closeDispatch(): void;
}

declare class AfterLoadEvent {
	public constructor(threshold: number);
	public addCallback(callback: (...args: Array<string>) => void): void;
	public trigger(...args: Array<string>): void;
}

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
	public value(value: string): void;
}
