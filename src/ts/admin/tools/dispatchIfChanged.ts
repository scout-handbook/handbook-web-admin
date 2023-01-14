import { dialog } from "../UI/dialog";
import { sidePanelClose } from "../UI/sidePanel";
import { ActionQueue } from "./ActionQueue";

export function dispatchIfChanged(
  actionQueue: ActionQueue,
  changed: boolean
): void {
  if (changed) {
    actionQueue.closeDispatch();
  } else {
    sidePanelClose();
    dialog("Akce byla úspěšná.", "OK");
  }
}
