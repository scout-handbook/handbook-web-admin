/* exported showLessonRestoreView */

function restoreLessonPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}

function showLessonRestoreView(name: string, body: string): void
{
	const aq = new ActionQueue([new Action(CONFIG["api-uri"] + "/v1.0/lesson", "POST", restoreLessonPayloadBuilder, [ActionCallback.FillID])])
	history.replaceState({}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	showLessonEditor(name, body, aq, null);
	changed = true;
}
