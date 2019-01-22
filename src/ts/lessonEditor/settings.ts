/* exported lessonSettings */

function renderField(): string
{
	var html = "<br><h3 class=\"sidePanelTitle noNewline\">Oblast</h3>"
	html += "<div class=\"button cyanButton\" id=\"changeField\"><i class=\"icon-pencil\"></i>Upravit</div><br>";
	if(!lessonSettingsCache.field)
	{
		html += "<span class=\"anonymousField\">Nezařazeno</span>"
	}
	else
	{
		for(var i = 0; i < FIELDS.length; i++)
		{
			if(FIELDS[i].id && FIELDS[i].id === lessonSettingsCache.field)
			{
				html += FIELDS[i].name;
				break;
			}
		}
	}
	return html;
}

function renderCompetences(): string
{
	var html = "<br><h3 class=\"sidePanelTitle noNewline\">Kompetence</h3>"
	html += "<div class=\"button cyanButton\" id=\"changeCompetences\"><i class=\"icon-pencil\"></i>Upravit</div>";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(lessonSettingsCache.competences.indexOf(COMPETENCES[i].id) >= 0)
		{
			html += "<br><span class=\"competenceNumber\">" + COMPETENCES[i].number + ":</span> " + COMPETENCES[i].name;
		}
	}
	return html;
}

function prerenderGroups(): string
{
	var html = "<br><h3 class=\"sidePanelTitle noNewline\">Skupiny</h3>"
	html += "<div class=\"button cyanButton\" id=\"changeGroups\"><i class=\"icon-pencil\"></i>Upravit</div><br><div id=\"settingsGroupList\"><div id=\"embeddedSpinner\"></div></div>";
	return html;
}

function renderGroups(): void
{
	document.getElementById("changeGroups")!.style.display = "inline-block";
	var html = "";
	for(var i = 0; i < GROUPS.length; i++)
	{
		if(lessonSettingsCache.groups.indexOf(GROUPS[i].id) >= 0)
		{
			if(GROUPS[i].id === "00000000-0000-0000-0000-000000000000")
			{
				html += "<span class=\"publicGroup\">" + GROUPS[i].name + "</span><br>";
			}
			else
			{
				html += GROUPS[i].name + "<br>";
			}
		}
	}
	document.getElementById("settingsGroupList")!.innerHTML = html;
}

function lessonSettings(id: string, actionQueue: ActionQueue, noHistory: boolean): void
{
	sidePanelOpen();
	var html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-right-open\"></i>Zavřít</div>";
	html += "<div class=\"button\" id=\"lessonHistoryOpen\"><i class=\"icon-history\"></i>Historie lekce</div>";
	html += renderField();
	html += renderCompetences();
	html += prerenderGroups();
	document.getElementById("sidePanel")!.innerHTML = html;
	lessonSettingsCacheEvent.addCallback(renderGroups);

	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};
	document.getElementById("lessonHistoryOpen")!.onclick = function(): void {lessonHistoryOpen(id, actionQueue);};
	document.getElementById("changeField")!.onclick = function(): void {changeLessonFieldOnClick(id, actionQueue);};
	document.getElementById("changeCompetences")!.onclick = function(): void {changeLessonCompetencesOnClick(id, actionQueue);};
	document.getElementById("changeGroups")!.onclick = function(): void {changeLessonGroupsOnClick(id, actionQueue);};
	if(!noHistory)
	{
		history.pushState({"sidePanel": "open"}, "title", "/admin/lessons");
	}
	refreshLogin();
}
