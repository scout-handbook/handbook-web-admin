/* global FIELDS:true, COMPETENCES:true, GROUPS:true, LOGINSTATE:true, metadataEvent:true */
/* exported FIELDS, COMPETENCES, GROUPS, LOGINSTATE, metadataSetup */

var metadataEvent: AfterLoadEvent;
var FIELDS = [];
var COMPETENCES = [];
var GROUPS = [];
var LOGINSTATE: Loginstate = {avatar: "", name: "", role: "guest"};

function refreshMetadata(): void
{
	metadataEvent = new AfterLoadEvent(4);
	request(CONFIG.apiuri + "/lesson?override-group=true", "GET", {}, function(response): void
	{
		FIELDS = response as unknown as Array<Field>;
		metadataEvent.trigger();
	}, undefined);
	request(CONFIG.apiuri + "/competence", "GET", {}, function(response): void
	{
		COMPETENCES = response as unknown as Array<Competence>;
		metadataEvent.trigger();
	}, undefined);
	var groupExceptionHandler = {"AuthenticationException": function(): void
	{
		window.location.href = CONFIG.apiuri + "/login?return-uri=" + encodeURIComponent(window.location.href);
	}, "RoleException": function(): void
	{
		window.location.replace(CONFIG['frontend-uri']);
	}};
	request(CONFIG.apiuri + "/group", "GET", {}, function(response): void
	{
		GROUPS = response as unknown as Array<Group>;
		metadataEvent.trigger();
	}, groupExceptionHandler);
	rawRequest(CONFIG.apiuri + "/account", "GET", undefined, function(response): void
	{
		if(response.status === 200)
		{
			if(["editor", "administrator", "superuser"].indexOf(response.response!.role as string) > -1)
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
			window.location.href = CONFIG.apiuri + "/login?return-uri=" + encodeURIComponent(window.location.href);
		}
		else
		{
			dialog("Nastala neznámá chyba. Chybová hláška:<br>" + response.message, "OK");
		}
	});
}

function metadataSetup(): void
{
	refreshMetadata();
}
