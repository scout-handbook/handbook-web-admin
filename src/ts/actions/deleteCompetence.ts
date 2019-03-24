/* exported deleteCompetenceOnClick */

function deleteCompetenceOnClick(event: MouseEvent): void
{
	var id = getAttribute(event, "id");
	var competence = COMPETENCES.get(id);
	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/competence/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat kompetenci " + competence.number + ": \"" + competence.name + "\"?", "Ano", aq.closeDispatch, "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/competences"); // eslint-disable-line compat/compat
	refreshLogin();
}
