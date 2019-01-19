"use strict";
/* exported showLessonRestoreView */

function showLessonRestoreView(name: string, body: string)
{
	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/lesson", "POST", restoreLessonPayloadBuilder)])
	aq.actions[0].callback = function(response) {aq.fillID(response as unknown as string)}
	showLessonEditor(name, body, aq, "");

	history.pushState({}, "title", "/admin/lessons");
}

function restoreLessonPayloadBuilder()
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}
