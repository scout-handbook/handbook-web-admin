/* global changed:true */
/* exported changed, changeLessonCompetencesOnClick */

var lessonCompetencesChanged = false;

function changeLessonCompetencesSave(id: string|null, actionQueue: ActionQueue): void
{
	id = id !== null ? id : "{id}";
	if(lessonCompetencesChanged)
	{
		changed = true;
		var competences = parseBoolForm();
		var encodedCompetences: Array<string> = [];
		for(var i = 0; i < competences.length; i++)
		{
			encodedCompetences.push(encodeURIComponent(competences[i]));
		}
		actionQueue.actions.push(new Action(CONFIG.apiuri + "/lesson/" + id + "/competence", "PUT", function(): Payload {return {"competence": encodedCompetences};}));
		lessonSettingsCache.competences = competences;
		lessonSettings(id, actionQueue, true);
	}
	else
	{
		lessonSettings(id, actionQueue, true);
	}
}

function lessonCompetenceOnclick(): void
{
	lessonCompetencesChanged = true;
}

function changeLessonCompetencesOnClick(id: string|null, actionQueue: ActionQueue): void
{
	lessonCompetencesChanged = false;
	var html = "<div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"changeLessonCompetencesSave\"><i class=\"icon-floppy\"></i>Uložit</div>";
	html += "<h3 class=\"sidePanelTitle\">Změnit kompetence</h3><form id=\"sidePanelForm\">";
	COMPETENCES.iterate(function(competenceId, competence)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\"";
		if(lessonSettingsCache.competences.indexOf(competenceId) >= 0)
		{
			html += " checked";
		}
		html += " data-id=\"" + competenceId + "\"";
		html += "><span class=\"formCustom formCheckbox\"></span></label>";
		html += "<span class=\"competenceNumber\">" + competence.number + ":</span> " + competence.name + "</div>";
	});
	html += "</form>";
	document.getElementById("sidePanel")!.innerHTML = html;

	document.getElementById("cancelEditorAction")!.onclick = function(): void
	{
		lessonSettings(id, actionQueue, true);
	};
	document.getElementById("changeLessonCompetencesSave")!.onclick = function(): void {changeLessonCompetencesSave(id, actionQueue);};

	var nodes = document.getElementById("sidePanelForm")!.getElementsByTagName("input");
	for(var j = 0; j < nodes.length; j++)
	{
		nodes[j].onchange = lessonCompetenceOnclick;
	}

	refreshLogin();
}
