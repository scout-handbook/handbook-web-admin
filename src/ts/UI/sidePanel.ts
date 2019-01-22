/* global sidePanelState:true */
/* exported sidePanelState, sidePanelOpen, sidePanelDoubleOpen, sidePanelClose */

var sidePanelState = false;

function sidePanelOpen(): void
{
	var sidePanel = document.getElementById("sidePanel")!;
	var overlay = document.getElementById("sidePanelOverlay")!;
	sidePanel.style.right = "0";
	sidePanel.style.width = "";
	overlay.style.display = "inline";
	sidePanelState = true;
}

function sidePanelDoubleOpen(): void
{
	var sidePanel = document.getElementById("sidePanel")!;
	sidePanel.style.width = "939px";
}

function sidePanelClose(): void
{
	var sidePanel = document.getElementById("sidePanel")!;
	var overlay = document.getElementById("sidePanelOverlay")!;
	sidePanel.style.right = "";
	overlay.style.display = "";
	sidePanelState = false;
}
