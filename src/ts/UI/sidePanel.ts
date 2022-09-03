export let sidePanelState = false;

export function sidePanelOpen(): void {
  const sidePanel = document.getElementById("side-panel")!;
  const overlay = document.getElementById("side-panel-overlay")!;
  sidePanel.style.right = "0";
  sidePanel.style.width = "";
  overlay.style.display = "inline";
  sidePanelState = true;
}

export function sidePanelDoubleOpen(): void {
  const sidePanel = document.getElementById("side-panel")!;
  sidePanel.style.width = "939px";
}

export function sidePanelClose(): void {
  const sidePanel = document.getElementById("side-panel")!;
  const overlay = document.getElementById("side-panel-overlay")!;
  sidePanel.style.right = "";
  overlay.style.display = "";
  sidePanelState = false;
}
