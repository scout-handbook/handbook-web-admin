import { MainPageTab } from "./MainPageTab";

export interface HistoryState {
  id?: string;
  page?: MainPageTab;
  sidePanelImageSelectorAction?: string;
  sidePanelImageSelectorState?: Record<string, string>;
}
