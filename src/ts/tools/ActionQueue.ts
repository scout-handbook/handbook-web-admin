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

	constructor(url: string, method: string, payloadBuilder: () => Payload = function(){return{};}, callback: (response: RequestResponse) => void = function(){}, exceptionHandler: ExceptionHandler = {})
	{
		this.url = url;
		this.method = method;
		this.payloadBuilder = payloadBuilder;
		this.callback = callback;
		this.exceptionHandler = exceptionHandler;
	}

	fillID(id: string)
		{
			this.url = this.url.replace("{id}", encodeURIComponent(id));
		};
}

function serializeAction(action: Action)
{
	return {"url": action.url, "method": action.method, "payload": action.payloadBuilder(), "callback": action.callback.toString()};
}

function deserializeAction(action: SerializedAction)
{
	return new Action(action.url, action.method, function()
		{
			return action.payload;
		}, eval('(' + action.callback + ')'), undefined);
}

function ActionQueueSetup()
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

	constructor(actions: Array<Action> = [], retry: boolean = false)
	{
		this.actions = actions;
		ActionQueueRetry = retry;
	}

	fillID(id: string)
		{
			for(var i = 0; i < this.actions.length; i++)
			{
				this.actions[i].fillID(id);
			}
		};

	addDefaultCallback()
		{
			var origCallback = this.actions[this.actions.length - 1].callback;
			this.actions[this.actions.length - 1].callback = function(response)
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
		};

	pop(propagate: boolean, background: boolean)
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
			request(this.actions[0].url, this.actions[0].method, this.actions[0].payloadBuilder(), function(response)
				{
					that.actions[0].callback(response);
					that.actions.shift();
					if(propagate)
					{
						that.pop(true, background);
					}
				}, this.actions[0].exceptionHandler);
		};

	dispatch(background: boolean)
		{
			this.pop(true, background);
		};
	defaultDispatch(background: boolean)
		{
			this.addDefaultCallback();
			this.dispatch(background);
		};
	closeDispatch()
		{
			sidePanelClose();
			this.defaultDispatch(false);
		};

	authException()
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
