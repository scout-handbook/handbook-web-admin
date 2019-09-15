/* global changed:true */
/* exported changed, changeLessonCompetencesOnClick */

let lessonCompetencesChanged = false;

function changeLessonCompetencesSave(id: string|null, actionQueue: ActionQueue): void
{
	id = id !== null ? id : "{id}";
	if(lessonCompetencesChanged)
	{
		changed = true;
		const competences = parseBoolForm();
		const encodedCompetences: Array<string> = [];
		for(let i = 0; i < competences.length; i++)
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
	let html = "<div class=\"button yellowButton\" id=\"cancelEditorAction\"><i class=\"icon-cancel\"></i>Zrušit</div>";
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

	const nodes = document.getElementById("sidePanelForm")!.getElementsByTagName("input");
	for(let i = 0; i < nodes.length; i++)
	{
		nodes[i].onchange = lessonCompetenceOnclick;
	}

	refreshLogin();
}
