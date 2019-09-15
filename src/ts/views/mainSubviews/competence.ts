/* global mainPageTab:true */
/* exported mainPageTab, showCompetenceSubview */

function renderCompetenceList(): string
{
	let html = "";
	COMPETENCES.iterate(function(id, competence)
	{
		html += "<h3 class = \"mainPage\">" + competence.number + ": " + competence.name + "</h3><br>";
		if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
		{
			html += "<div class=\"button cyanButton changeCompetence\" data-id=\"" + id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
			html += "<div class=\"button redButton deleteCompetence\" data-id=\"" + id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div><br>";
		}
		html += "<span class=\"mainPage competenceDescription\">" + competence.description + "</span><br>";
	});
	return html;
}

function showCompetenceSubview(noHistory: boolean): void
{
	mainPageTab = "competences";
	const nodes = getElementsByClassName("topBarTab");
	for(let i = 0; i < nodes.length; i++)
	{
		nodes[i].className = "topBarTab";
	}
	document.getElementById("competenceManager")!.className += " activeTopBarTab";
	let html = "<h1>" + CONFIG["site-name"] + " - Kompetence</h1>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button greenButton\" id=\"addCompetence\"><i class=\"icon-plus\"></i>Přidat</div><br>";
	}
	html += renderCompetenceList()
	document.getElementById("mainPage")!.innerHTML = html;
	document.getElementById("mainPageContainer")!.scrollTop = 0;

	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("addCompetence")!.onclick = addCompetence;
	}

	addOnClicks("changeCompetence", changeCompetenceOnClick);
	addOnClicks("deleteCompetence", deleteCompetenceOnClick);
	if(!noHistory)
	{
		history.pushState({"page": "competences"}, "title", "/admin/competences"); // eslint-disable-line compat/compat
	}
	refreshLogin(true);
}
