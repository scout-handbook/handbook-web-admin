/* exported deleteLessonOnClick */

function deleteLessonDialog(id: string): void
{
	const name = LESSONS.get(id)!.name;

	const saveExceptionHandler = {"NotLockedException": function(): void {dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");}};
	const discardExceptionHandler = {"NotFoundException": null};
	const saveActionQueue = new ActionQueue([new Action(CONFIG["api-uri"] + "/v1.0/lesson/" + encodeURIComponent(id), "DELETE", undefined, [], saveExceptionHandler)]);
	const discardActionQueue = new ActionQueue([new Action(CONFIG["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id) , "DELETE", undefined, [], discardExceptionHandler)]);
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
		dialog("Nelze smazat lekci, protože ji právě upravuje " + response.holder! + ".", "OK");
	};
	request(CONFIG["api-uri"] + "/v1.0/mutex/" + encodeURIComponent(id), "POST", {}, function(): void
	{
		deleteLessonDialog(id);
	}, exceptionHandler);
}
