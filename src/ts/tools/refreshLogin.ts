/* exported refreshLogin */

function refreshLogin(forceRelogin = false, afterAction: (() => void)|null = null): void
{
	const allCookies = "; " + document.cookie;
	const parts = allCookies.split("; skautis_timeout=");
	if(parts.length === 2)
	{
		const timeout = parseInt(parts.pop()!.split(";").shift()!);
		if((timeout - Math.round(new Date().getTime() / 1000)) < 1500)
		{
			const exceptionHandler = {"AuthenticationException": function(): void
			{
				if(forceRelogin)
				{
					window.location.replace(CONFIG.apiuri + "/login?return-uri=/admin/" + mainPageTab);
				}
			}};
			request(CONFIG.apiuri + "/refresh", "GET", {}, function(): void
			{
				if(afterAction)
				{
					afterAction();
				}
			}, exceptionHandler);
		}
	}
}
