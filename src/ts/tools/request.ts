/* exported reAuthHandler, authFailHandler, request */

const reAuthHandler = {"AuthenticationException": function(): void
{
	window.location.replace(CONFIG["api-uri"] + "/v0.9/login");
}};
const authFailHandler = {"AuthenticationException": function(): void
{
	dialog("Proběhlo automatické odhlášení. Přihlašte se prosím a zkuste to znovu.", "OK");
}};

function requestQueryBuilder(payload: Payload): string
{
	let query = "";
	let first = true;
	for(const key in payload)
	{
		if(!Object.prototype.hasOwnProperty.call(payload, key))
		{
			continue;
		}
		if(Array.isArray(payload[key]))
		{
			for(let i = 0; i < (payload[key] as Array<string>).length; i++)
			{
				if(!first)
				{
					query += "&";
				}
				query += key + "[]=" + (payload[key] as Array<string>)[i];
				first = false;
			}
		}
		else
		{
			if(!first)
			{
				query += "&";
			}
			query += key + "=" + (payload[key] as string);
		}
		first = false;
	}
	return query;
}

function rawRequest(url: string, method: string, payload: Payload = {}, callback: (response: APIResponse) => void): void
{
	const xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(): void
	{
		if(this.readyState === 4)
		{
			callback(JSON.parse(this.responseText));
		}
	}
	let query = "";
	if(payload)
	{
		if(method === "GET" || method === "DELETE" || payload.toString() !== "[object FormData]")
		{
			query = requestQueryBuilder(payload);
		}
		if((method === "GET" || method === "DELETE") && query)
		{
			url += "?" + query;
		}
	}
	xhr.open(method, url, true);
	if(method === "GET" || method === "DELETE" || payload.toString() !== "[object FormData]")
	{
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	}
	if(method === "GET" || method === "DELETE")
	{
		xhr.send();
	}
	else if(payload.toString() !== "[object FormData]")
	{
		xhr.send(query);
	}
	else
	{
		xhr.send(payload as unknown as string);
	}
}

function request(url: string, method: string, payload: Payload, callback: (response: RequestResponse) => void, exceptionHandler: ExceptionHandler = {}): void
{
	rawRequest(url, method, payload, function(response): void
	{
		if(Math.floor(response.status / 100) === 2)
		{
			callback(response.response!);
		}
		else if(Object.prototype.hasOwnProperty.call(exceptionHandler, response.type!))
		{
			exceptionHandler[response.type!]!(response);
		}
		else
		{
			dialog("Nastala neznámá chyba. Chybová hláška:<br>" + (response.message as string), "OK");
		}
	});
}
