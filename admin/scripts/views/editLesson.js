"use strict";

var imageSelectorOpen = false;

function showLessonEditView(id, noHistory)
{
	spinner();
	request(CONFIG.apiuri + "/mutex/" + encodeURIComponent(id), "POST", {}, function(response)
		{
			if(response.status === 201)
			{
				getLessonEditView(id, noHistory);
			}
			else if(response.status === 409)
			{
				dialog("Nelze upravovat lekci, protože ji právě upravuje " + response.response.holder + ".", "OK");
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace(CONFIG.apiuri + "/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}

function getLessonEditView(id, noHistory)
{
	request(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id), "GET", {}, function(response)
		{
			if(response.status === 200)
			{
				metadataEvent.addCallback(function()
					{
						renderLessonEditView(id, response.response, noHistory);
					});
			}
			else if(response.type === "AuthenticationException")
			{
				window.location.replace(CONFIG.apiuri + "/login");
			}
			else
			{
				dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
			}
		});
}

function renderLessonEditView(id, markdown, noHistory)
{
	dismissSpinner();
	var lesson = getLessonById(id);
	if(!noHistory)
	{
		history.pushState({"id": id}, "title", "/admin/lessons");
	}

	var exceptionHandler = {"NotLockedException": function(){dialog("Kvůli příliš malé aktivitě byla lekce odemknuta a již ji upravil někdo jiný. Zkuste to prosím znovu.", "OK");}}

	var aq = new ActionQueue([new Action(CONFIG.apiuri + "/lesson/" + encodeURIComponent(id) , "PUT", saveLessonPayloadBuilder, function(){}, exceptionHandler)]);
	showLessonEditor(lesson.name, markdown, aq, id);
	document.getElementById("save").dataset.id = id;
}

function saveLessonPayloadBuilder()
{
	return {"name": encodeURIComponent(document.getElementById("name").value), "body": encodeURIComponent(editor.value())};
}
