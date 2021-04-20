/* exported importGroupOnClick */

let participantEvent: AfterLoadEvent;
let addEvent: AfterLoadEvent;
let groupEvent: AfterLoadEvent;

let participants: Array<Participant>;
let users: Array<User>;

function setdiff(a: Array<Participant>, b: Array<User>): Array<Participant>
{
	const bArr = b.map(function(x): number {
		return x.id;
	});
	const result = [];
	for(let i = 0; i < a.length; i++)
	{
		if(bArr.indexOf(a[i].id) < 0)
		{
			result.push(a[i]);
		}
	}
	return result;
}

function importGroupSave(id: string): void
{
	const participants: Array<Participant> = [];
	const nodes = document.getElementById("sidePanelForm")!.getElementsByTagName("input");
	for(let i = 0; i < nodes.length; i++)
	{
		if(nodes[i].checked)
		{
			participants.push({"id": parseInt(nodes[i].dataset.id!), "name": nodes[i].dataset.name!})
		}
	}

	if(participants.length === 0)
	{
		return;
	}

	const html = "<div id=\"embeddedSpinner\"></div>";
	document.getElementById("importList")!.innerHTML = html;

	addEvent = new AfterLoadEvent(participants.length);
	for(let i = 0; i < participants.length; i++)
	{
		request(CONFIG.apiuri + "/user", "POST", participants[i], function(): void {addEvent.trigger();}, authFailHandler);
	}

	addEvent.addCallback(function(): void
	{
		groupEvent = new AfterLoadEvent(participants.length);
		for(let i = 0; i < participants.length; i++)
		{
			const payload = {"group": id};
			request(CONFIG.apiuri + "/user/" + participants[i].id.toString() + "/group", "PUT", payload, function(): void {groupEvent.trigger();}, authFailHandler);
		}

		groupEvent.addCallback(function(): void
		{
			sidePanelClose();
			spinner();
			dialog("Akce byla úspěšná.", "OK");
			refreshMetadata();
			history.back();
		});
	});

	sidePanelClose();
	spinner();
}

function importGroupSelectParticipantsRender(id: string): void
{
	const newparticipants = setdiff(participants, users);
	if(newparticipants.length === 0)
	{
		sidePanelClose();
		spinner();
		dialog("Akce nemá žádné účastníky (kteří ještě nebyli importováni).", "OK");
		refreshMetadata();
		history.back();
	}
	let html = "<h4>Výběr účastníků:</h4><form id=\"sidePanelForm\">";
	for(let i = 0; i < newparticipants.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"checkbox\" data-id=\"" + newparticipants[i].id.toString() + "\" data-name=\"" + newparticipants[i].name + "\"><span class=\"formCustom formCheckbox\"></span></label>" + newparticipants[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("importList")!.innerHTML = html;
	document.getElementById("importGroupNext")!.innerHTML = "<i class=\"icon-floppy\"></i>Uložit";
	document.getElementById("importGroupNext")!.onclick = function(): void {importGroupSave(id)};
}

function importGroupSelectParticipants(id: string): void
{
	const eventId = parseBoolForm()[0];
	if(eventId)
	{
		const html = "<div id=\"embeddedSpinner\"></div>";
		document.getElementById("importList")!.innerHTML = html;
		participantEvent = new AfterLoadEvent(2);
		participantEvent.addCallback(importGroupSelectParticipantsRender);
		const exceptionHandler = reAuthHandler;
		exceptionHandler.SkautISAuthorizationException = function(): void
		{
			sidePanelClose();
			dialog("Pro tuto akci nemáte ve SkautISu dostatečná práva.", "OK");
		};
		request(CONFIG.apiuri + "/event/" + eventId + "/participant", "GET", {}, function(response: RequestResponse): void
		{
			participants = response as unknown as Array<Participant>;
			participantEvent.trigger(id);
		}, exceptionHandler);
		request(CONFIG.apiuri + "/user", "GET", {"page": 1, "per-page": 1000, "group": id}, function(response: RequestResponse): void
		{
			users = response.users as Array<User>;
			participantEvent.trigger(id);
		}, reAuthHandler);
		document.getElementById("importGroupNext")!.removeAttribute("onclick");
	}
}

function importGroupSelectEventRender(id: string, events: Array<Event>): void
{
	if(events.length === 0)
	{
		sidePanelClose();
		spinner();
		dialog("Nejste instruktorem na žádné akci.", "OK");
		refreshMetadata();
		history.back();
	}
	let html = "<h4>Volba kurzu:</h4><form id=\"sidePanelForm\">";
	for(let i = 0; i < events.length; i++)
	{
		html += "<div class=\"formRow\"><label class=\"formSwitch\"><input type=\"radio\" name=\"field\" data-id=\"" + events[i].id.toString() + "\"><span class=\"formCustom formRadio\"></span></label>" + events[i].name + "</div>";
	}
	html += "</form>";
	document.getElementById("importList")!.innerHTML = html;
	document.getElementById("importGroupNext")!.onclick = function(): void {importGroupSelectParticipants(id)};
}

function importGroupOnClick(event: MouseEvent): void
{
	sidePanelOpen();
	let html = "<div class=\"button yellowButton\" id=\"sidePanelCancel\"><i class=\"icon-cancel\"></i>Zrušit</div>";
	html += "<div class=\"button greenButton\" id=\"importGroupNext\"><i class=\"icon-fast-fw\"></i>Pokračovat</div>";
	for(let i = 0; i < GROUPS.length; i++)
	{
		if(GROUPS[i].id === getAttribute(event, "id"))
		{
			html += "<h3 class=\"sidePanelTitle\">Importovat ze SkautISu: " + GROUPS[i].name + "</h3>";
			break;
		}
	}
	html += "<div id=\"importList\"><div id=\"embeddedSpinner\"></div></div>";
	document.getElementById("sidePanel")!.innerHTML = html;
	document.getElementById("sidePanelCancel")!.onclick = function(): void
	{
		history.back();
	};
	request(CONFIG.apiuri + "/event", "GET", {}, function(response: RequestResponse): void
	{
		importGroupSelectEventRender(getAttribute(event, "id"), response as unknown as Array<Event>);
	}, reAuthHandler);

	history.pushState({"sidePanel": "open"}, "title", "/admin/groups"); // eslint-disable-line compat/compat
	refreshLogin();
}
