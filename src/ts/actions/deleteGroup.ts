/* exported deleteGroupOnClick */

function deleteGroupOnClick(event: MouseEvent): void
{
	let name = "";
	for(let i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id === getAttribute(event, "id"))
		{
			name = GROUPS[i].name
			break;
		}
	}

	const aq = new ActionQueue([new Action(CONFIG.apiuri + "/group/" + encodeURIComponent(getAttribute(event, "id")), "DELETE")]);
	dialog("Opravdu si přejete smazat skupinu \"" + name + "\"?", "Ano", () => aq.closeDispatch(), "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/groups"); // eslint-disable-line compat/compat
	refreshLogin();
}
