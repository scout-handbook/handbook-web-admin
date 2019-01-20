/* eslint strict: "off", no-unused-vars: "off" */

declare var COMPETENCES: Array<Competence>;
declare var CONFIG: Config;
declare var FIELDS: Array<Field>;
declare var GROUPS: Array<Group>;
declare var LOGINSTATE: Loginstate;
declare var authFailHandler: ExceptionHandler;
declare var mainPageTab: MainPageTab;
declare var metadataEvent: AfterLoadEvent;
declare var reAuthHandler: ExceptionHandler;
declare function refreshLogin(forceRelogin?: boolean, afterAction?: () => void): void;
declare function refreshMetadata(): void;
declare function refreshPreview(name: string, markdown: string, id: string): void;
declare function request(url: string, method: string, payload: Payload, callback: (response: RequestResponse) => void, exceptionHandler?: ExceptionHandler): void;

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
	public value(value: string): void; // eslint-disable-line no-dupe-class-members
}
