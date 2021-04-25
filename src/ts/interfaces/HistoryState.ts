/* exported HistoryState */

interface HistoryState {
  id?: string;
  page?: MainPageTab;
  sidePanelImageSelectorAction?: string;
  sidePanelImageSelectorState?: Record<string, string>;
}
