/* exported showLessonRestoreView */

function restoreLessonPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}

function showLessonRestoreView(name: string, body: string): void
{
	const aq = new ActionQueue([new Action(CONFIG["api-uri"] + "/v0.9/lesson", "POST", restoreLessonPayloadBuilder, [ActionCallback.FillID])])
	showLessonEditor(name, body, aq, "");

	history.pushState({}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
}
