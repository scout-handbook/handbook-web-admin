/// <reference types="EasyMDE" />
declare var COMPETENCES: IDList<Competence>;
declare var CONFIG: Config;
declare var FULLFIELDS: IDList<FullField>;
declare var GROUPS: Array<Group>;
declare var LESSONS: IDList<Lesson>;
declare var LOGINSTATE: Loginstate;
declare var authFailHandler: ExceptionHandler;
declare var mainPageTab: MainPageTab;
declare var metadataEvent: AfterLoadEvent;
declare var reAuthHandler: ExceptionHandler;
declare function refreshLogin(forceRelogin?: boolean, afterAction?: () => void): void;
declare function refreshMetadata(): void;
declare function refreshPreview(name: string, markdown: string, id: string): void;
declare function request(url: string, method: string, payload: Payload, callback: (response: RequestResponse) => void, exceptionHandler?: ExceptionHandler): void;
