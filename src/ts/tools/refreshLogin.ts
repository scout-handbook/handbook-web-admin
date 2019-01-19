"use strict";
/* exported refreshLogin */

function refreshLogin(forceRelogin: boolean, afterAction: () => void)
{
	var allCookies = "; " + document.cookie;
	var parts = allCookies.split("; skautis_timeout=");
	if(parts.length === 2)
	{
		var timeout = parseInt(parts.pop()!.split(";").shift()!);
		if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
		{
			var exceptionHandler = {"AuthenticationException": function()
				{
					if(forceRelogin)
					{
						window.location.replace(CONFIG.apiuri + "/login?return-uri=/admin/" + mainPageTab);
					}
				}};
			request(CONFIG.apiuri + "/refresh", "GET", {}, function()
				{
					if(afterAction)
					{
						afterAction();
					}
				}, exceptionHandler);
		}
	}
}
