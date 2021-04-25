/* exported dispatchIfChanged */

function dispatchIfChanged(actionQueue: ActionQueue, changed: boolean): void {
  if (changed) {
    actionQueue.closeDispatch();
  } else {
    sidePanelClose();
    dialog("Akce byla úspěšná.", "OK");
  }
}
