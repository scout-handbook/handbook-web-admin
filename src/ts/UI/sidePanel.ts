/* global sidePanelState:true */
/* exported sidePanelState, sidePanelOpen, sidePanelDoubleOpen, sidePanelClose */

let sidePanelState = false;

function sidePanelOpen(): void {
  const sidePanel = document.getElementById("side-panel")!;
  const overlay = document.getElementById("side-panel-overlay")!;
  sidePanel.style.right = "0";
  sidePanel.style.width = "";
  overlay.style.display = "inline";
  sidePanelState = true;
}

function sidePanelDoubleOpen(): void {
  const sidePanel = document.getElementById("side-panel")!;
  sidePanel.style.width = "939px";
}

function sidePanelClose(): void {
  const sidePanel = document.getElementById("side-panel")!;
  const overlay = document.getElementById("side-panel-overlay")!;
  sidePanel.style.right = "";
  overlay.style.display = "";
  sidePanelState = false;
}
