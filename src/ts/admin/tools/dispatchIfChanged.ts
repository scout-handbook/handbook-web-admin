import { ActionQueue } from "./ActionQueue";
import { dialog } from "../UI/dialog";
import { sidePanelClose } from "../UI/sidePanel";

export function dispatchIfChanged(actionQueue: ActionQueue, changed: boolean): void {
  if (changed) {
    actionQueue.closeDispatch();
  } else {
    sidePanelClose();
    dialog("Akce byla úspěšná.", "OK");
  }
}
