declare class Action { // eslint-disable-line @typescript-eslint/no-extraneous-class
	public constructor(url: string, method: string, payloadBuilder?: () => Payload, callback?: Array<ActionCallback>, exceptionHandler?: ExceptionHandler);
}
