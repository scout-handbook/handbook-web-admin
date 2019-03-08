declare class Action {
	public constructor(url: string, method: string, payloadBuilder?: () => Payload, callback?: Array<ActionCallback>, exceptionHandler?: ExceptionHandler);
}
