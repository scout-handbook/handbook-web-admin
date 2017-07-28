var lessonListEvent = new AfterLoadEvent(3);
var FIELDS = [];
var COMPETENCES = [];
var LOGINSTATE = [];

function mainPageSetup()
{
	getMainPage();
	lessonListSetup();
}

function lessonListSetup()
{
	request("/API/v0.9/list_lessons", "", function(response)
		{
			FIELDS = JSON.parse(response);
			lessonListEvent.trigger();
		});
	request("/API/v0.9/list_competences", "", function(response)
		{
			COMPETENCES = JSON.parse(response);
			lessonListEvent.trigger();
		});
	request("/API/v0.9/get_login_state", "", function(response)
		{
			LOGINSTATE = JSON.parse(response);
			lessonListEvent.trigger();
		});
}

function getMainPage(noHistory)
{
	lessonListEvent.addCallback(function()
		{
			showMainPage(noHistory);
		});
}

function showMainPage(noHistory)
{
	var html = "<div id=\"sidePanel\"></div><div id=\"sidePanelOverlay\"></div><div id=\"mainPageContainer\"><div id=\"mainPage\"></div></div>";
	document.getElementsByTagName("main")[0].innerHTML = html;
	document.getElementsByTagName("main")[0].scrollTop = 0;

	showLessonManager();

	if(!noHistory)
	{
		history.pushState({"lessonName": ""}, "title", "/admin/");
	}
}
