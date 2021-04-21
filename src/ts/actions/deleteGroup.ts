/* exported deleteGroupOnClick */

function deleteGroupOnClick(event: MouseEvent): void
{
	const id = getAttribute(event, "id");
	const aq = new ActionQueue([new Action(CONFIG["api-uri"] + "/v1.0/group/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat skupinu \"" + GROUPS.get(id).name + "\"?", "Ano", () => aq.closeDispatch(), "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/groups"); // eslint-disable-line compat/compat
	refreshLogin();
}
