declare class ActionQueue {
  public actions: Array<Action>;
  public constructor(actions?: Array<Action>, retry?: boolean);
  public fillID(id: string): void;
  public dispatch(background: boolean): void;
  public defaultDispatch(background: boolean): void;
  public closeDispatch(): void;
}
