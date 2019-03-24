/* exported deleteGroupOnClick */

function deleteGroupOnClick(event: MouseEvent): void
{
	var id = getAttribute(event, "id");
	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/group/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat skupinu \"" + GROUPS.get(id).name + "\"?", "Ano", aq.closeDispatch, "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/groups"); // eslint-disable-line compat/compat
	refreshLogin();
}
