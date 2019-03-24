/* exported deleteFieldOnClick */

function deleteFieldOnClick(event: MouseEvent): void
{
	var id = getAttribute(event, "id");
	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/field/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat oblast \"" + FULLFIELDS.get(id).name + "\"?", "Ano", aq.closeDispatch, "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	refreshLogin();
}
