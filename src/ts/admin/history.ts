import { HistoryState } from "./interfaces/HistoryState";
import { MainPageTab } from "./interfaces/MainPageTab";
import {
  imageSelectorOpen,
  prepareImageSelector,
} from "./lessonEditor/imageSelector";
import { metadataEvent } from "./metadata";
import { sidePanelClose, sidePanelState } from "./UI/sidePanel";
import {
  closeSidePanelImageSelector,
  sidePanelImageSelectorState,
} from "./UI/sidePanelImageSelector";
import { showLessonEditView } from "./views/editLesson";
import { setMainPageTab, showMainView } from "./views/main";

function popback(): void {
  if (history.state) {
    const state = history.state as HistoryState;
    if (sidePanelImageSelectorState) {
      closeSidePanelImageSelector();
    } else if (sidePanelState) {
      sidePanelClose();
    } else if (state.id) {
      if (imageSelectorOpen) {
        prepareImageSelector();
      } else {
        metadataEvent.addCallback(function (): void {
          showLessonEditView(state.id!, true);
        });
      }
    } else if (state.page) {
      setMainPageTab(state.page);
      showMainView(true);
    } else {
      showMainView(false);
    }
  }
}

export function historySetup(): void {
  window.onpopstate = popback;
  if (window.location.pathname.substring(7)) {
    setMainPageTab(window.location.pathname.substring(7) as MainPageTab);
  }
  showMainView(false);
}
