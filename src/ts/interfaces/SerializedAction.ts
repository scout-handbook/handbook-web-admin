interface SerializedAction {
  url: string;
  method: string;
  payload: Payload;
  callbacks: Array<ActionCallback>;
}
