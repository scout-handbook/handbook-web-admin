/* exported deleteFieldOnClick */

function deleteFieldOnClick(event: MouseEvent): void
{
	let name = "";
	const id = getAttribute(event, "id");
	for(let i = 0; i < FIELDS.length; i++)
	{
		if(FIELDS[i].id === id)
		{
			name = FIELDS[i].name
			break;
		}
	}

	const aq = new ActionQueue([new Action(CONFIG["api-uri"] + "/v0.9/field/" + encodeURIComponent(id), "DELETE")]);
	dialog("Opravdu si přejete smazat oblast \"" + name + "\"?", "Ano", () => aq.closeDispatch(), "Ne", function(): void {history.back();});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	refreshLogin();
}
