/* exported deleteLessonOnClick */

function deleteLessonDialog(id: string): void
{
	let name = "";
	outer:
	for(let i = 0; i < FIELDS.length; i++)
	{
		for(let j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				name = FIELDS[i].lessons[j].name
				break outer;
			}
		}
	}

	const saveExceptionHandler = {"NotLockedException": function(): void {dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");}};
	const discardExceptionHandler = {"NotFoundException": null};
	const saveActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id), "DELETE", undefined, [], saveExceptionHandler)]);
	const discardActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "DELETE", undefined, [], discardExceptionHandler)]);
	dialog("Opravdu si přejete smazat lekci \"" + name + "\"?", "Ano", () => saveActionQueue.closeDispatch(), "Ne", function(): void
	{
		discardActionQueue.dispatch(true);
		history.back();
	});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	refreshLogin();
}

function deleteLessonOnClick(event: MouseEvent): void
{
	const id = getAttribute(event, "id");
	spinner();
	const exceptionHandler = reAuthHandler;
	exceptionHandler["LockedException"] = function(response: APIResponse): void
	{
		dialog("Nelze smazat lekci, protože ji právě upravuje " + response.holder + ".", "OK");
	};
	request(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id), "POST", {}, function(): void
	{
		deleteLessonDialog(id);
	}, exceptionHandler);
}
