/* exported showLessonRestoreView */

function restoreLessonPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}

function showLessonRestoreView(name: string, body: string): void
{
	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/lesson", "POST", restoreLessonPayloadBuilder)])
	aq.actions[0].callback = function(response): void {aq.fillID(response as unknown as string)}
	showLessonEditor(name, body, aq, "");

	history.pushState({}, "title", "/admin/lessons");
}
