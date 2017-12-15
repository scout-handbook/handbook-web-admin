function addCompetence()
{
	sidePanelOpen();
	var html = "<div class=\"newButton yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"newButton greenButton\" id=\"addCompetenceSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Přidat kompetenci</h3><form id=\"sidePanelForm\">";
	html += "<span class=\"heading\">Kompetence</span> <input type=\"text\" class=\"formText formName\" id=\"competenceNumber\" value=\"00\" autocomplete=\"off\"><br>";
	html += "<input type=\"text\" class=\"formText\" id=\"competenceName\" value=\"Nová kompetence\" autocomplete=\"off\"><br>";
	html += "<textarea rows=\"5\" class=\"formText\" id=\"competenceDescription\" autocomplete=\"off\">Popis nové kompetence</textarea>";
	html += "</form>";
	document.getElementById("sidePanel").innerHTML = html;

	document.getElementById("sidePanelCancel").onclick = function()
		{
			history.back();
		};
	document.getElementById("addCompetenceSave").onclick = addCompetenceSave;

	history.pushState({"sidePanel": "open"}, "title", "/admin/competences");
	refreshLogin();
}

function addCompetenceSave()
{
	var payload = {"number": encodeURIComponent(document.getElementById("competenceNumber").value), "name": encodeURIComponent(document.getElementById("competenceName").value), "description": encodeURIComponent(document.getElementById("competenceDescription").value)};
	sidePanelClose();
	spinner();
	retryAction("/API/v0.9/competence", "POST", payload);
}
