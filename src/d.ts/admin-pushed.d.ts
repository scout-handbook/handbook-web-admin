/// <reference types="xss" />
declare const CONFIG: Config;
declare const imageSelectorOpen: boolean;
declare const sidePanelState: boolean;
declare const sidePanelImageSelectorState: SidePanelImageSelectorGlobalState|undefined;
declare function closeSidePanelImageSelector(): void;
declare function dialog(mainText: string, confirmText: string, confirmCallback?: () => void, dismissText?: string, dismissCallback?: () => void): void;
declare function dismissSpinner(): void;
declare function prepareImageSelector(page?: number, perPage?: number): void;
declare function removeBeacon(): void;
declare function showCompetenceSubview(noHistory: boolean): void;
declare function showGroupSubview(noHistory: boolean): void;
declare function showImageSubview(noHistory: boolean): void;
declare function showLessonEditView(id: string, noHistory: boolean): void;
declare function showLessonSubview(noHistory: boolean): void;
declare function showUserSubview(noHistory: boolean): void;
declare function sidePanelClose(): void;
declare function spinner(): void;
declare function xssOptions(): XSS.IFilterXSSOptions;
