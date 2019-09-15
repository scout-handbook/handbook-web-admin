/* exported deleteCompetenceOnClick */

function deleteCompetenceOnClick(event: MouseEvent): void
{
	var number = 0;
	var name = "";
	for(var i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id === getAttribute(event, "id"))
		{
			number = COMPETENCES[i].number
			name = COMPETENCES[i].name
			break;
		}
	}

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/competence/" + encodeURIComponent(getAttribute(event, "id")), "DELETE")]);

	dialog("Opravdu si přejete smazat kompetenci " + number + ": \"" + name + "\"?", "Ano", () => aq.closeDispatch(), "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/competences"); // eslint-disable-line compat/compat
	refreshLogin();
}
