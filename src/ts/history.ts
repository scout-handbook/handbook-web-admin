/* global mainPageTab:true */
/* exported historySetup, mainPageTab */

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
      mainPageTab = state.page;
      showMainView(true);
    } else {
      showMainView(false);
    }
  }
}

function historySetup(): void {
  window.onpopstate = popback;
  if (window.location.pathname.substring(7)) {
    mainPageTab = window.location.pathname.substring(7) as MainPageTab;
  }
  showMainView(false);
}
