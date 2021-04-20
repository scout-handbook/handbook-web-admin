/* global mainPageTab:true */
/* exported mainPageTab, showLessonSubview */

function renderLessonListLesson(id: string, lesson: Lesson, secondLevel: string): string
{
	let html = "<br><h3 class=\"mainPage" + secondLevel + "\">" + lesson.name + "</h3>";
	html += "<div class=\"button cyanButton changeLesson\" data-id=\"" + id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button redButton deleteLesson\" data-id=\"" + id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div>";
	}
	html += "<a href=\"" + CONFIG['admin-uri'] + "/lesson/" + id + "\" target=\"_blank\" class=\"button exportLesson\"><i class=\"icon-file-pdf\"></i>PDF</a>";
	html += "<br><span class=\"mainPage" + secondLevel + "\">Kompetence: ";
	let first = true;
	COMPETENCES.iterate(function(competenceId, competence)
	{
		if(lesson.competences.indexOf(competenceId) >= 0)
		{
			if(!first)
			{
				html += ", ";
			}
			html += competence.number.toString();
			first = false;
		}
	});
	html += "</span>";
	return html;
}

function renderLessonList(): string
{
	let html = "";
	LESSONS.iterate(function(id, lesson)
	{
		let inField = false;
		FIELDS.iterate(function(_, field)
		{
			if(field.lessons.indexOf(id) >= 0)
			{
				inField = true;
			}
		});
		if(!inField)
		{
			html += renderLessonListLesson(id, lesson, "");
		}
	});
	FIELDS.iterate(function(id, field)
	{
		html += "<br><h2 class=\"mainPage\">" + field.name + "</h2>";
		if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
		{
			html += "<div class=\"button cyanButton changeField\" data-id=\"" + id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
			html += "<div class=\"button redButton deleteField\" data-id=\"" + id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div>";
		}
		html += "<div class=\"button greenButton addLessonInField\" data-id=\"" + id + "\"><i class=\"icon-plus\"></i>Přidat lekci</div>";
		LESSONS.iterate(function(lessonId, lesson)
		{
			if(field.lessons.indexOf(lessonId) >= 0)
			{
				html += renderLessonListLesson(lessonId, lesson, " secondLevel");
			}
		});
	});
	return html;
}

function changeLessonOnClick(event: MouseEvent): boolean
{
	showLessonEditView(getAttribute(event, "id"), false);
	return false;
}

function showLessonSubview(noHistory: boolean): void
{
	mainPageTab = "lessons";
	const nodes = getElementsByClassName("topBarTab");
	for(let i = 0; i < nodes.length; i++)
	{
		nodes[i].className = "topBarTab";
	}
	document.getElementById("lessonManager")!.className += " activeTopBarTab";
	let html = "<h1>" + CONFIG["site-name"] + " - Lekce</h1>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button greenButton\" id=\"addField\"><i class=\"icon-plus\"></i>Přidat oblast</div>";
	}
	html += "<div class=\"button greenButton\" id=\"addLesson\"><i class=\"icon-plus\"></i>Přidat lekci</div>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button\" id=\"restoreLesson\"><i class=\"icon-history\"></i>Smazané lekce</div>";
	}
	html += renderLessonList();
	document.getElementById("mainPage")!.innerHTML = html;
	document.getElementById("mainPageContainer")!.scrollTop = 0;

	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("addField")!.onclick = function(): void
		{
			addField();
		};
	}
	document.getElementById("addLesson")!.onclick = function(): void {showLessonAddView();};
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("restoreLesson")!.onclick = restoreLesson;
	}

	addOnClicks("changeField", changeFieldOnClick);
	addOnClicks("deleteField", deleteFieldOnClick);
	addOnClicks("addLessonInField", addLessonInFieldOnClick);
	addOnClicks("changeLesson", changeLessonOnClick);
	addOnClicks("deleteLesson", deleteLessonOnClick);
	if(!noHistory)
	{
		history.pushState({"page": "lessons"}, "title", "/admin/lessons"); // eslint-disable-line compat/compat
	}
	refreshLogin(true);
}
