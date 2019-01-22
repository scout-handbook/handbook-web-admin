/* eslint strict: "off", no-unused-vars: "off" */

declare var CONFIG: Config;
declare var imageSelectorOpen: boolean;
declare var sidePanelState: boolean;
declare function dialog(mainText: string, confirmText: string, confirmCallback?: () => void, dismissText?: string, dismissCallback?: () => void): void;
declare function filterXSS(html: string, options: XSSOptions): string;
declare function prepareImageSelector(page?: number, perPage?: number): void;
declare function showCompetenceSubview(noHistory: boolean): void;
declare function showGroupSubview(noHistory: boolean): void;
declare function showImageSubview(noHistory: boolean): void;
declare function showLessonEditView(id: string, noHistory: boolean): void;
declare function showLessonSubview(noHistory: boolean): void;
declare function showUserSubview(noHistory: boolean): void;
declare function sidePanelClose(): void;
declare function spinner(): void;
declare function xssOptions(): XSSOptions;
