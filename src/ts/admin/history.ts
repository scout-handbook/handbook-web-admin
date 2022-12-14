import { navigate } from "svelte-navigator";

import { HistoryState } from "./interfaces/HistoryState";
import {
  imageSelectorOpen,
  prepareImageSelector,
} from "./lessonEditor/imageSelector";
import { metadataEvent } from "./metadata";
import { sidePanelClose, sidePanelState } from "./UI/sidePanel";

function popback(): void {
  if (history.state) {
    const state = history.state as HistoryState;
    if (sidePanelState) {
      sidePanelClose();
    } else if (state.id) {
      if (imageSelectorOpen) {
        prepareImageSelector();
      } else {
        metadataEvent.addCallback(function (): void {
          navigate("/admin/lessons/" + state.id! + "/edit");
        });
      }
    }
  }
}

export function historySetup(): void {
  window.onpopstate = popback;
}
