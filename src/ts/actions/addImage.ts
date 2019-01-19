"use strict";
/* exported addImage */

function addImage(inEditor: boolean)
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"addImageSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Nahrát obrázek</h3><form id=\"sidePanelForm\">";
	html += "<div class=\"formRow\"><label class=\"formFile\">";
	html += "<input type=\"file\" class=\"formFile\" id=\"addImageFile\">";
	html += "<div class=\"button\"><i class=\"icon-upload\"></i>Vybrat soubor</div></label>"
	html += "</div></form>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("sidePanelCancel")!.onclick = function()
		{
			history.back();
		};
	document.getElementById("addImageSave")!.onclick = addImageSave;

	document.getElementById("addImageFile")!.onchange = changeLabel;

	if(inEditor)
	{
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	}
	else
	{
		history.pushState({"sidePanel": "open"}, "title", "/admin/images");
	}
	refreshLogin();
}

function changeLabel(event: Event)
{
	var element = event.target as HTMLInputElement;
	if(element.files)
	{
		element.parentElement!.children[1].innerHTML = "<i class=\"icon-upload\"></i>" + element.files[0].name;
	}
}

function addImageSave()
{
	if((document.getElementById("addImageFile") as HTMLInputElement).value !== "")
	{
		var formData = new FormData()
		formData.append("image", (document.getElementById("addImageFile") as HTMLInputElement).files![0])
		sidePanelClose();
		spinner();
		request(CONFIG.apiuri + "/image", "POST", formData, function()
			{
				dialog("Akce byla úspěšná.", "OK");
				refreshMetadata();
				history.back();
			}, authFailHandler);
	}
}
