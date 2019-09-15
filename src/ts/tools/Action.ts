/* exported serializeAction, deserializeAction */

class Action
{
	public url: string;
	public method: string;
	public payloadBuilder: () => Payload;
	public callbacks: Array<ActionCallback>;
	public exceptionHandler: ExceptionHandler;

	public constructor(url: string, method: string, payloadBuilder: () => Payload = function(): Payload {return{};}, callbacks: Array<ActionCallback> = [], exceptionHandler: ExceptionHandler = {})
	{
		this.url = url;
		this.method = method;
		this.payloadBuilder = payloadBuilder;
		this.callbacks = callbacks;
		this.exceptionHandler = exceptionHandler;
	}

	public callback(response: RequestResponse, actionQueue: ActionQueue): void
	{
		for(let i = 0; i < this.callbacks.length; i++)
		{
			switch(this.callbacks[i])
			{
				case ActionCallback.DialogConfirm:
					this.dialogConfirm();
					break;
				case ActionCallback.DismissSpinner:
					dismissSpinner();
					break;
				case ActionCallback.FillID:
					actionQueue.fillID(response as unknown as string);
					break;
				case ActionCallback.RemoveBeacon:
					removeBeacon();
					break;
			}
		}
	}

	public dialogConfirm(): void
	{
		dialog("Akce byla úspěšná.", "OK");
		refreshMetadata();
		if(ActionQueueRetry)
		{
			showMainView(false);
		}
		else
		{
			history.back();
		}
	}

	public fillID(id: string): void
	{
		this.url = this.url.replace("{id}", encodeURIComponent(id));
	}
}

function serializeAction(action: Action): SerializedAction
{
	return {"url": action.url, "method": action.method, "payload": action.payloadBuilder(), "callbacks": action.callbacks};
}

function deserializeAction(action: SerializedAction): Action
{
	return new Action(action.url, action.method, function(): Payload
	{
		return action.payload;
	}, action.callbacks, undefined);
}
