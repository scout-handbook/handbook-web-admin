/* exported deleteLessonOnClick */

function deleteLessonDialog(id: string): void
{
	var name = "";
	outer:
	for(var i = 0; i < FIELDS.length; i++)
	{
		for(var j = 0; j < FIELDS[i].lessons.length; j++)
		{
			if(FIELDS[i].lessons[j].id === id)
			{
				name = FIELDS[i].lessons[j].name
				break outer;
			}
		}
	}

	var saveExceptionHandler = {"NotLockedException": function(): void {dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");}};
	var discardExceptionHandler = {"NotFoundException": null};
	var saveActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id), "DELETE", undefined, [], saveExceptionHandler)]);
	var discardActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "DELETE", undefined, [], discardExceptionHandler)]);
	dialog("Opravdu si přejete smazat lekci \"" + name + "\"?", "Ano", saveActionQueue.closeDispatch, "Ne", function(): void
	{
		discardActionQueue.dispatch(true);
		history.back();
	});
	history.pushState({"sidePanel": "open"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	refreshLogin();
}

function deleteLessonOnClick(event: MouseEvent): void
{
	var id = getAttribute(event, "id");
	spinner();
	var exceptionHandler = reAuthHandler;
	exceptionHandler["LockedException"] = function(response: APIResponse): void
	{
		dialog("Nelze smazat lekci, protože ji právě upravuje " + response.holder + ".", "OK");
	};
	request(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id), "POST", {}, function(): void
	{
		deleteLessonDialog(id);
	}, exceptionHandler);
}
