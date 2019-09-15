/* exported addGroup */

function addGroupPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("groupName") as HTMLInputElement).value)};
}

function addGroup(): void
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"addGroupSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat skupinu</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	html += "<input type=\"text\" class=\"formText\" id=\"groupName\" value=\"Nová skupina\" autocomplete=\"off\"><br>";
	html += "</form>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/group", "POST", addGroupPayloadBuilder)]);
	document.getElementById("addGroupSave")!.onclick = (): void => aq.closeDispatch();

	history.pushState({"sidePanel": "open"}, "title", "/admin/groups"); // eslint-disable-line compat/compat
	refreshLogin();
}
