"use strict";
/* exported imageSelectorOpen, showLessonEditView */

var imageSelectorOpen = false;

function showLessonEditView(id: string, noHistory: boolean): void
{
	spinner();
	var exceptionHandler = reAuthHandler;
	exceptionHandler["LockedException"] = function(response: APIResponse): void
		{
			dialog("Nelze upravovat lekci, protože ji právě upravuje " + response.holder + ".", "OK");
		};
	request(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id), "POST", {}, function(): void
		{
			getLessonEditView(id, noHistory);
		}, exceptionHandler);
}

function getLessonEditView(id: string, noHistory: boolean): void
{
	request(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id), "GET", {}, function(response: RequestResponse): void
		{
			metadataEvent.addCallback(function(): void
				{
					renderLessonEditView(id, response as unknown as string, noHistory);
				});
		}, reAuthHandler);
}

function renderLessonEditView(id: string, markdown: string, noHistory: boolean): void
{
	dismissSpinner();
	var lesson = getLessonById(id)!;
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/lessons");
	}

	var saveExceptionHandler = {"NotLockedException": function(): void
		{
			dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");
		}};
	var discardExceptionHandler = {"NotFoundException": function(): void {}};

	var saveActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id) , "PUT", saveLessonPayloadBuilder, removeBeacon, saveExceptionHandler)]);
	var discardActionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "DELETE", undefined, function(): void
		{
			removeBeacon();
			dismissSpinner();
		}, discardExceptionHandler)]);
	showLessonEditor(lesson.name, markdown, saveActionQueue, id, discardActionQueue, function(): void {lessonEditMutexExtend(id);});
	document.getElementById("save")!.dataset.id = id;

	window.onbeforeunload = function(): void {sendBeacon(id);};
}

function saveLessonPayloadBuilder(): Payload
{
	return {"name": encodeURIComponent((document.getElementById("name") as HTMLInputElement).value), "body": encodeURIComponent(editor.value())};
}

function lessonEditMutexExtend(id: string): void
{
	var exceptionHandler = {"NotFoundException": function(): void {}};
	var actionQueue = new ActionQueue([new Action(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id) , "PUT", undefined, undefined, exceptionHandler)]);
	actionQueue.dispatch(true);
}

function sendBeacon(id: string): void
{
	if(navigator.sendBeacon)
	{
		navigator.sendBeacon(CONFIG.apiuri + "/mutex-beacon/" + encodeURIComponent(id));
	}
}

function removeBeacon(): void
{
	window.onbeforeunload = null;
}
