"use strict";
/* exported ActionQueueSetup */

var ActionQueueRetry = false;

class Action
{
	public url: string;
	public method: string;
	public payloadBuilder: () => Payload;
	public callback: (response: RequestResponse) => void;
	public exceptionHandler: ExceptionHandler;

	public constructor(url: string, method: string, payloadBuilder: () => Payload = function(): Payload {return{};}, callback: (response: RequestResponse) => void = function(): void {}, exceptionHandler: ExceptionHandler = {})
	{
		this.url = url;
		this.method = method;
		this.payloadBuilder = payloadBuilder;
		this.callback = callback;
		this.exceptionHandler = exceptionHandler;
	}

	public fillID(id: string): void
		{
			this.url = this.url.replace("{id}", encodeURIComponent(id));
		}
}

function serializeAction(action: Action): SerializedAction
{
	return {"url": action.url, "method": action.method, "payload": action.payloadBuilder(), "callback": action.callback.toString()};
}

function deserializeAction(action: SerializedAction): Action
{
	return new Action(action.url, action.method, function(): Payload
		{
			return action.payload;
		}, eval('(' + action.callback + ')'), undefined);
}

function ActionQueueSetup(): void
{
	if(window.sessionStorage && sessionStorage.getItem("ActionQueue"))
	{
		var aq = new ActionQueue(JSON.parse(sessionStorage.getItem("ActionQueue")!).map(deserializeAction), false);
		ActionQueueRetry = true;
		sessionStorage.clear();
		aq.dispatch(false);
	}
}

class ActionQueue {
	private actions: Array<Action>;

	public constructor(actions: Array<Action> = [], retry = false)
	{
		this.actions = actions;
		ActionQueueRetry = retry;
	}

	/* tslint:disable:no-unused-variable */
	public fillID(id: string): void
		{
			for(var i = 0; i < this.actions.length; i++)
			{
				this.actions[i].fillID(id);
			}
		}

	public dispatch(background: boolean): void
		{
			this.pop(true, background);
		}
	public defaultDispatch(background: boolean): void
		{
			this.addDefaultCallback();
			this.dispatch(background);
		}
	public closeDispatch(): void
		{
			sidePanelClose();
			this.defaultDispatch(false);
		}

	private addDefaultCallback(): void
		{
			var origCallback = this.actions[this.actions.length - 1].callback;
			this.actions[this.actions.length - 1].callback = function(response): void
				{
					dialog("Akce byla úspěšná.", "OK");
					refreshMetadata();
					if(!ActionQueueRetry && origCallback)
					{
						origCallback(response);
					}
					if(ActionQueueRetry)
					{
						showMainView(false);
					}
					else
					{
						history.back();
					}
				};
		}

	private pop(propagate: boolean, background: boolean): void
		{
			if(this.actions.length <= 1)
			{
				propagate = false;
			}
			if(!background)
			{
				spinner();
			}
			this.actions[0].exceptionHandler["AuthenticationException"] = this.authException;
			var that = this;
			request(this.actions[0].url, this.actions[0].method, this.actions[0].payloadBuilder(), function(response): void
				{
					that.actions[0].callback(response);
					that.actions.shift();
					if(propagate)
					{
						that.pop(true, background);
					}
				}, this.actions[0].exceptionHandler);
		}

	private authException(): void
		{
			if(!ActionQueueRetry && window.sessionStorage)
			{
				sessionStorage.setItem("ActionQueue", JSON.stringify(this.actions.map(serializeAction)));
				window.location.replace(CONFIG.apiuri + "/login?return-uri=/admin/" + mainPageTab);
			}
			else
			{
				dialog("Byl jste odhlášen a akce se nepodařila. Přihlašte se prosím a zkuste to znovu.", "OK");
			}
		}
}
