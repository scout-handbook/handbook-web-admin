/* global changed:true */
/* exported changed, addLessonInFieldOnClick */

function addLessonPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}

function showLessonAddView(field?: string): void
{
	history.pushState({}, "title", "/admin/lessons");

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/lesson", "POST", addLessonPayloadBuilder, [ActionCallback.FillID])])
	if(field)
	{
		aq.actions.push(new Action(CONFIG.apiuri + "/lesson/{id}/field", "PUT", function(): Payload {return {"field": encodeURIComponent(field)};}))
	}
	showLessonEditor(defaultName, defaultBody, aq, null);
	changed = true;
}

function addLessonInFieldOnClick(event: MouseEvent): void
{
	showLessonAddView(getAttribute(event, "id"));
}
