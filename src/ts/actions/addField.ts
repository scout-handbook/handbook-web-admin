/* exported addField */

function addFieldPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("fieldName") as HTMLInputElement).value), "description": encodeURIComponent((document.getElementById("fieldDescription") as HTMLInputElement).value), "image": encodeURIComponent((document.getElementById("fieldImage") as HTMLInputElement).value)};
}

function addField(state: SidePanelImageSelectorState = {name: "Nová oblast", description: "Popis nové oblasti", image: "00000000-0000-0000-0000-000000000000"}, noHistory = false): void
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"addFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat oblast</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	html += "<input type=\"text\" class=\"formText formName\" id=\"fieldName\" value=\"" + state.name + "\" autocomplete=\"off\">";
	html += "<textarea rows=\"5\" class=\"formText\" id=\"fieldDescription\" autocomplete=\"off\">" + state.description + "</textarea>";
	html += "<legend for=\"fieldImage\">Náhledový obrázek:</legend>";
	html += "<input type=\"hidden\" id=\"fieldImage\" value=\"" + state.image + "\">";
	html += "<image src=\"" + CONFIG.apiuri + "/image/" + state.image + "?quality=thumbnail\">";
	html += "<br><div class=\"button\" id=\"fieldImageChange\"><i class=\"icon-pencil\"></i>Změnit</div>"
	html += "</form>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};
	document.getElementById("fieldImageChange")!.onclick = function(): void
	{
		openSidePanelImageSelector("addField", {name: (document.getElementById("fieldName") as HTMLInputElement).value, description: (document.getElementById("fieldDescription") as HTMLInputElement).value, image: state.image});
	};

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/field", "POST", addFieldPayloadBuilder)]);
	document.getElementById("addFieldSave")!.onclick = () => aq.closeDispatch();

	if(!noHistory)
	{
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	}
	refreshLogin();
}
