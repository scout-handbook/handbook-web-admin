/* global COMPETENCES:true, FIELDS:true, GROUPS:true, LESSONS:true, LOGINSTATE:true, metadataEvent:true */
/* exported COMPETENCES, FIELDS, GROUPS, LESSONS, LOGINSTATE, metadataSetup */

let metadataEvent: AfterLoadEvent;
let FIELDS: IDList<Field>;
let COMPETENCES: IDList<Competence>;
let GROUPS: IDList<Group>;
let LESSONS: IDList<Lesson>;
let LOGINSTATE: Loginstate = {avatar: "", name: "", role: "guest"};

function refreshMetadata(): void
{
	metadataEvent = new AfterLoadEvent(5);
	request(CONFIG["api-uri"] + "/v1.0/lesson?override-group=true", "GET", {}, function(response): void
	{
		LESSONS = new IDList<Lesson>(response as IDListItems<Lesson>);
		metadataEvent.trigger();
	}, undefined);
	request(CONFIG["api-uri"] + "/v1.0/field", "GET", {}, function(response): void
	{
		FIELDS = new IDList<Field>(response as IDListItems<Field>);
		metadataEvent.trigger();
	}, undefined);
	request(CONFIG["api-uri"] + "/v1.0/competence", "GET", {}, function(response): void
	{
		COMPETENCES = new IDList<Competence>(response as IDListItems<Competence>);
		metadataEvent.trigger();
	}, undefined);
	const groupExceptionHandler = {"AuthenticationException": function(): void
	{
		window.location.href = CONFIG["api-uri"] + "/v1.0/login?return-uri=" + encodeURIComponent(window.location.href);
	}, "RoleException": function(): void
	{
		window.location.replace(CONFIG['frontend-uri']);
	}};
	request(CONFIG["api-uri"] + "/v1.0/group", "GET", {}, function(response): void
	{
		GROUPS = new IDList<Group>(response as IDListItems<Group>);
		metadataEvent.trigger();
	}, groupExceptionHandler);
	rawRequest(CONFIG["api-uri"] + "/v1.0/account", "GET", undefined, function(response): void
	{
		if(response.status === 200)
		{
			if(["editor", "administrator", "superuser"].indexOf(response.response!.role) > -1)
			{
				LOGINSTATE = response.response as unknown as Loginstate;
				metadataEvent.trigger();
			}
			else
			{
				window.location.replace(CONFIG['frontend-uri']);
			}
		}
		else if(response.status === 401)
		{
			window.location.href = CONFIG["api-uri"] + "/v1.0/login?return-uri=" + encodeURIComponent(window.location.href);
		}
		else
		{
			dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message!, "OK");
		}
	});
}

function metadataSetup(): void
{
	refreshMetadata();
}
