"use strict";
/* exported addLessonInFieldOnClick */

function showLessonAddView(field?: string)
{
	history.pushState({}, "title", "/admin/lessons");

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/lesson", "POST", addLessonPayloadBuilder)])
	if(field)
	{
		aq.actions.push(new Action(CONFIG.apiuri + "/lesson/{id}/field", "PUT", function() {return {"field": encodeURIComponent(field)};}))
	}
	aq.actions[0].callback = function(response) {aq.fillID(response as unknown as string)}
	showLessonEditor(defaultName, defaultBody, aq, "");
}

function addLessonPayloadBuilder()
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}

function addLessonInFieldOnClick(event: MouseEvent)
{
	showLessonAddView(getAttribute(event, "id"));
}
