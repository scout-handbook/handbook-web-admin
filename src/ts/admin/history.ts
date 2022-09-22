import { navigate } from "svelte-navigator";

import { HistoryState } from "./interfaces/HistoryState";
import {
  closeSidePanelImageSelector,
  sidePanelImageSelectorState,
} from "./UI/sidePanelImageSelector";
import {
  imageSelectorOpen,
  prepareImageSelector,
} from "./lessonEditor/imageSelector";
import { metadataEvent } from "./metadata";
import { sidePanelClose, sidePanelState } from "./UI/sidePanel";
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
          navigate("/admin/lessons/" + state.id! + "/edit");
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
}
