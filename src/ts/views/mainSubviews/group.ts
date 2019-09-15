/* global mainPageTab:true */
/* exported mainPageTab, showGroupSubview */

function renderGroupList(): string
{
	let html = "";
	GROUPS.iterate(function(id, group)
	{
		if(id === "00000000-0000-0000-0000-000000000000")
		{
			html += "<br><h3 class = \"mainPage publicGroup\">" + group.name + "</h3>";
		}
		else
		{
			html += "<br><h3 class = \"mainPage\">" + group.name + "</h3>";
		}
		if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
		{
			html += "<div class=\"button cyanButton changeGroup\" data-id=\"" + id + "\"><i class=\"icon-pencil\"></i>Upravit</div>";
			if(id !== "00000000-0000-0000-0000-000000000000")
			{
				html += "<div class=\"button redButton deleteGroup\" data-id=\"" + id + "\"><i class=\"icon-trash-empty\"></i>Smazat</div>";
				html += "<div class=\"button importGroup\" data-id=\"" + id + "\"><i class=\"icon-user-plus\"></i> Importovat ze SkautISu</div>";
			}
		}
		if(id !== "00000000-0000-0000-0000-000000000000")
		{
			html += "<br><span class=\"mainPage\">Uživatelů: " + group.count + "</span>";
		}
	});
	return html;
}

function showGroupSubview(noHistory: boolean): void
{
	mainPageTab = "groups";
	const nodes = getElementsByClassName("topBarTab");
	for(let i = 0; i < nodes.length; i++)
	{
		nodes[i].className = "topBarTab";
	}
	document.getElementById("groupManager")!.className += " activeTopBarTab";
	let html = "<h1>" + CONFIG["site-name"] + " - Uživatelské skupiny</h1>";
	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		html += "<div class=\"button greenButton\" id=\"addGroup\"><i class=\"icon-plus\"></i>Přidat</div>";
	}
	html += renderGroupList()
	document.getElementById("mainPage")!.innerHTML = html;
	document.getElementById("mainPageContainer")!.scrollTop = 0;

	if(LOGINSTATE.role === "administrator" || LOGINSTATE.role === "superuser")
	{
		document.getElementById("addGroup")!.onclick = addGroup;
	}

	addOnClicks("changeGroup", changeGroupOnClick);
	addOnClicks("importGroup", importGroupOnClick);
	addOnClicks("deleteGroup", deleteGroupOnClick);
	if(!noHistory)
	{
		history.pushState({"page": "groups"}, "title", "/admin/groups"); // eslint-disable-line compat/compat
	}
	refreshLogin(true);
}
