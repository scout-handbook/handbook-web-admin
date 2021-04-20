/* exported deleteCompetenceOnClick */

function deleteCompetenceOnClick(event: MouseEvent): void
{
	const id = getAttribute(event, "id");
	const competence = COMPETENCES.get(id);
	const aq = new ActionQueue([new Action(CONFIG.apiuri + "/competence/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat kompetenci " + competence.number.toString() + ": \"" + competence.name + "\"?", "Ano", () => aq.closeDispatch(), "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/competences"); // eslint-disable-line compat/compat
	refreshLogin();
}
