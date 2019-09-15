/// <reference types="EasyMDE" />
declare const COMPETENCES: Array<Competence>;
declare const CONFIG: Config;
declare const FIELDS: Array<Field>;
declare const FULLFIELDS: Array<FullField>;
declare const GROUPS: Array<Group>;
declare const LOGINSTATE: Loginstate;
declare const authFailHandler: ExceptionHandler;
declare let mainPageTab: MainPageTab;
declare const metadataEvent: AfterLoadEvent;
declare const reAuthHandler: ExceptionHandler;
declare function refreshLogin(forceRelogin?: boolean, afterAction?: (() => void)|null): void;
declare function refreshMetadata(): void;
declare function refreshPreview(name: string, markdown: string, id: string): void;
declare function request(url: string, method: string, payload: Payload, callback: (response: RequestResponse) => void, exceptionHandler?: ExceptionHandler): void;
