/* global FIELDS:true, FULLFIELDS:true, COMPETENCES:true, GROUPS:true, LOGINSTATE:true, metadataEvent:true */
/* exported FIELDS, FULLFIELDS, COMPETENCES, GROUPS, LOGINSTATE, metadataSetup */

let metadataEvent: AfterLoadEvent;
let FIELDS = [];
let FULLFIELDS = [];
let COMPETENCES = [];
let GROUPS = [];
let LOGINSTATE: Loginstate = {avatar: "", name: "", role: "guest"};

function refreshMetadata(): void
{
	metadataEvent = new AfterLoadEvent(5);
	request(CONFIG["api-uri"] + "/v0.9/lesson?override-group=true", "GET", {}, function(response): void
	{
		FIELDS = response as unknown as Array<Field>;
		metadataEvent.trigger();
	}, undefined);
	request(CONFIG["api-uri"] + "/v0.9/field", "GET", {}, function(response): void
	{
		FULLFIELDS = response as unknown as Array<FullField>;
		metadataEvent.trigger();
	}, undefined);
	request(CONFIG["api-uri"] + "/v0.9/competence", "GET", {}, function(response): void
	{
		COMPETENCES = response as unknown as Array<Competence>;
		metadataEvent.trigger();
	}, undefined);
	const groupExceptionHandler = {"AuthenticationException": function(): void
	{
		window.location.href = CONFIG["api-uri"] + "/v0.9/login?return-uri=" + encodeURIComponent(window.location.href);
	}, "RoleException": function(): void
	{
		window.location.replace(CONFIG['frontend-uri']);
	}};
	request(CONFIG["api-uri"] + "/v0.9/group", "GET", {}, function(response): void
	{
		GROUPS = response as unknown as Array<Group>;
		metadataEvent.trigger();
	}, groupExceptionHandler);
	rawRequest(CONFIG["api-uri"] + "/v0.9/account", "GET", undefined, function(response): void
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
			window.location.href = CONFIG["api-uri"] + "/v0.9/login?return-uri=" + encodeURIComponent(window.location.href);
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
