"use strict";

function refreshLogin(forceRelogin, afterAction)
{
	var allCookies = "; " + document.cookie;
	var parts = allCookies.split("; skautis_timeout=");
	if(parts.length === 2)
	{
		var timeout = parts.pop().split(";").shift();
		if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
		{
			var exceptionHandler = {"AuthenticationException": function()
				{
					if(forceRelogin)
					{
						window.location.replace(CONFIG.apiuri + "/login?return-uri=/admin/" + mainPageTab);
					}
				}};
			newRequest(CONFIG.apiuri + "/refresh", "GET", undefined, function(response)
				{
					if(afterAction)
					{
						afterAction();
					}
				}, exceptionHandler);
		}
	}
}
