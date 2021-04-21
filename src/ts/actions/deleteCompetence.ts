/* exported deleteCompetenceOnClick */

function deleteCompetenceOnClick(event: MouseEvent): void
{
	let number = 0;
	let name = "";
	for(let i = 0; i < COMPETENCES.length; i++)
	{
		if(COMPETENCES[i].id === getAttribute(event, "id"))
		{
			number = COMPETENCES[i].number
			name = COMPETENCES[i].name
			break;
		}
	}

	const aq = new ActionQueue([new Action(CONFIG["api-uri"] + "/v0.9/competence/" + encodeURIComponent(getAttribute(event, "id")), "DELETE")]);

	dialog("Opravdu si přejete smazat kompetenci " + number.toString() + ": \"" + name + "\"?", "Ano", () => aq.closeDispatch(), "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/competences"); // eslint-disable-line compat/compat
	refreshLogin();
}
