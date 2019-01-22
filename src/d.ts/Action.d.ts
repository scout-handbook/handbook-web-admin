declare class Action {
	public callback: (response: RequestResponse) => void;
	public constructor(url: string, method: string, payloadBuilder?: () => Payload, callback?: (response: RequestResponse) => void, exceptionHandler?: ExceptionHandler);
}
