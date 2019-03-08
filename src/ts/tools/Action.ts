/* exported serializeAction, deserializeAction */

class Action
{
	public url: string;
	public method: string;
	public payloadBuilder: () => Payload;
	public callbacks: Array<ActionCallback>;
	public exceptionHandler: ExceptionHandler;

	public constructor(url: string, method: string, payloadBuilder: () => Payload = function(): Payload {return{};}, callbacks: Array<ActionCallback> = [ActionCallback.Nothing], exceptionHandler: ExceptionHandler = {})
	{
		this.url = url;
		this.method = method;
		this.payloadBuilder = payloadBuilder;
		this.callbacks = callbacks;
		this.exceptionHandler = exceptionHandler;
	}

	public runCallback(response: RequestResponse): void
	{
		for(var i = 0; i < this.callbacks.length; i++)
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
					// TODO
					break;
				case ActionCallback.RemoveBeacon:
					removeBeacon();
					break;
				default:
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
