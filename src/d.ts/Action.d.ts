declare class Action {
  // eslint-disable-line @typescript-eslint/no-extraneous-class
  public url: string;
  public method: string;
  public payloadBuilder: () => Payload;
  public callbacks: Array<ActionCallback>;
  public exceptionHandler: ExceptionHandler;
  public constructor(
    url: string,
    method: string,
    payloadBuilder?: () => Payload,
    callback?: Array<ActionCallback>,
    exceptionHandler?: ExceptionHandler
  );
  public callback(response: RequestResponse, actionQueue: ActionQueue): void;
  public fillID(id: string): void;
}
