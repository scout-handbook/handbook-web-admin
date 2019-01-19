"use strict";
/* exported imageSelectorOpen, showLessonEditView */

var imageSelectorOpen = false;

function showLessonEditView(id: string, noHistory: boolean)
{
	spinner();
	var exceptionHandler = reAuthHandler;
	exceptionHandler["LockedException"] = function(response: APIResponse)
		{
			dialog("Nelze upravovat lekci, protože ji právě upravuje " + response.holder + ".", "OK");
		};
	request(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id), "POST", undefined, function()
		{
			getLessonEditView(id, noHistory);
		}, exceptionHandler);
}

function getLessonEditView(id: string, noHistory: boolean)
{
	request(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id), "GET", undefined, function(response: RequestResponse)
		{
			metadataEvent.addCallback(function()
				{
					renderLessonEditView(id, response as unknown as string, noHistory);
				});
		}, reAuthHandler);
}

function renderLessonEditView(id: string, markdown: string, noHistory: boolean)
{
	dismissSpinner();
	var lesson = getLessonById(id);
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/lessons");
	}

	var saveExceptionHandler = {"NotLockedException": function(){dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");}};
	var discardExceptionHandler = {"NotFoundException": function(){}};

	var saveActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id) , "PUT", saveLessonPayloadBuilder, removeBeacon, saveExceptionHandler)]);
	var discardActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "DELETE", undefined, function()
		{
			removeBeacon();
			dismissSpinner();
		}, discardExceptionHandler)]);
	showLessonEditor(lesson.name, markdown, saveActionQueue, id, discardActionQueue, function() {lessonEditMutexExtend(id);});
	document.getElementById("save")!.dataset.id = id;

	window.onbeforeunload = function() {sendBeacon(id);};
}

function saveLessonPayloadBuilder()
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}

function lessonEditMutexExtend(id: string)
{
	var exceptionHandler = {"NotFoundException": function(){}};
	var actionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "PUT", undefined, undefined, exceptionHandler)]);
	actionQueue.dispatch(true);
}

function sendBeacon(id: string)
{
	if(navigator.sendBeacon)
	{
		navigator.sendBeacon(CONFIG.apiuri + "/mutex-beacon/" + encodeURIComponent(id));
	}
}

function removeBeacon()
{
	window.onbeforeunload = null;
}
