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
