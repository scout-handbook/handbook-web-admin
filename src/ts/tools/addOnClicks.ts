import { getElementsByClassName } from "./getElementsByClassName";

export function addOnClicks(id: string, onclick: (event: MouseEvent) => void): void {
  const nodes = getElementsByClassName(
    id,
    document.getElementsByTagName("main")[0]
  );
  for (let i = 0; i < nodes.length; i++) {
    (nodes[i] as HTMLElement).onclick = onclick;
  }
}
