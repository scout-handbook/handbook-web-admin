/* exported changeFieldOnClick */

let fieldChanged = false;

function changeFieldPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("fieldName") as HTMLInputElement).value), "description": encodeURIComponent((document.getElementById("fieldDescription") as HTMLInputElement).value), "image": encodeURIComponent((document.getElementById("fieldImage") as HTMLInputElement).value), "icon": encodeURIComponent((document.getElementById("fieldIcon") as HTMLInputElement).value)};
}

function changeField(state: SidePanelImageSelectorState, noHistory = false, changed = false): void
{
	fieldChanged = changed;
	sidePanelOpen();
	let html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeFieldSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Upravit oblast</h3><form id=\"sidePanelForm\">";
	html += "<legend for=\"fieldName\">Název:</legend>";
	html += "<input type=\"text\" class=\"formText formName\" id=\"fieldName\" value=\"" + state.name + "\" autocomplete=\"off\">";
	html += "<textarea rows=\"5\" class=\"formText\" id=\"fieldDescription\" autocomplete=\"off\">" + state.description + "</textarea>";
	html += "<legend for=\"fieldImage\">Náhledový obrázek:</legend>";
	html += "<input type=\"hidden\" id=\"fieldImage\" value=\"" + state.image + "\">";
	html += "<image src=\"" + CONFIG.apiuri + "/image/" + state.image + "?quality=thumbnail\">";
	html += "<br><div class=\"button\" id=\"fieldImageChange\"><i class=\"icon-pencil\"></i>Změnit</div>"
	html += "<legend for=\"fieldIcon\">Ikona:</legend>";
	html += "<input type=\"hidden\" id=\"fieldIcon\" value=\"" + state.icon + "\">";
	html += "<image src=\"" + CONFIG.apiuri + "/image/" + state.icon + "?quality=thumbnail\">";
	html += "<br><div class=\"button\" id=\"fieldIconChange\"><i class=\"icon-pencil\"></i>Změnit</div>"
	html += "</form>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};

	document.getElementById("fieldImageChange")!.onclick = function(): void
	{
		openSidePanelImageSelector("changeField", "image", {id: state.id, name: (document.getElementById("fieldName") as HTMLInputElement).value, description: (document.getElementById("fieldDescription") as HTMLInputElement).value, image: state.image, icon: state.icon});
	}

	document.getElementById("fieldIconChange")!.onclick = function(): void
	{
		openSidePanelImageSelector("changeField", "icon", {id: state.id, name: (document.getElementById("fieldName") as HTMLInputElement).value, description: (document.getElementById("fieldDescription") as HTMLInputElement).value, image: state.image, icon: state.icon});
	}

	const aq = new ActionQueue([new Action(CONFIG.apiuri + "/field/" + encodeURIComponent(state.id), "PUT", changeFieldPayloadBuilder)]);
	document.getElementById("changeFieldSave")!.onclick = function(): void
	{
		dispatchIfChanged(aq, fieldChanged);
	};

	document.getElementById("fieldName")!.oninput = function(): void
	{
		fieldChanged = true;
	};
	document.getElementById("fieldName")!.onchange = function(): void
	{
		fieldChanged = true;
	};
	document.getElementById("fieldDescription")!.oninput = function(): void
	{
		fieldChanged = true;
	};
	document.getElementById("fieldDescription")!.onchange = function(): void
	{
		fieldChanged = true;
	};

	if(!noHistory)
	{
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	}
	refreshLogin();
}

function changeFieldOnClick(event: MouseEvent): void
{
	for(let i = 0; i < FULLFIELDS.length; i++)
	{
		if(FULLFIELDS[i].id === getAttribute(event, "id"))
		{
			changeField({id: FULLFIELDS[i].id, name: FULLFIELDS[i].name, description: FULLFIELDS[i].description, image: FULLFIELDS[i].image, icon: FULLFIELDS[i].icon})
			break;
		}
	}
}
