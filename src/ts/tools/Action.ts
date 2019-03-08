/* exported serializeAction, deserializeAction */

class Action
{
	public url: string;
	public method: string;
	public payloadBuilder: () => Payload;
	public callback: ActionCallback;
	public exceptionHandler: ExceptionHandler;

	public constructor(url: string, method: string, payloadBuilder: () => Payload = function(): Payload {return{};}, callback: ActionCallback = ActionCallback.Nothing, exceptionHandler: ExceptionHandler = {})
	{
		this.url = url;
		this.method = method;
		this.payloadBuilder = payloadBuilder;
		this.callback = callback;
		this.exceptionHandler = exceptionHandler;
	}

	public runCallback(response: RequestResponse): void
	{
		switch(this.callback)
		{
			case ActionCallback.DialogConfirm:
				this.dialogConfirm();
				break;
			default:
				break;
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
	return {"url": action.url, "method": action.method, "payload": action.payloadBuilder(), "callback": action.callback.toString()};
}

function deserializeAction(action: SerializedAction): Action
{
	return new Action(action.url, action.method, function(): Payload
	{
		return action.payload;
	}, eval('(' + action.callback + ')'), undefined);
}
