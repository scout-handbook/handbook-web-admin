import { Action } from "../tools/Action";
import { ActionQueue } from "../tools/ActionQueue";
import { dialog } from "../UI/dialog";
import { getAttribute } from "../UI/button";
import { refreshLogin } from "../tools/refreshLogin";

export function deleteImageOnClick(event: MouseEvent): void {
  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] +
        "/v1.0/image/" +
        encodeURIComponent(getAttribute(event, "id")),
      "DELETE"
    ),
  ]);
  dialog(
    "Opravdu si přejete smazat tento obrázek?",
    "Ano",
    () => aq.closeDispatch(),
    "Ne",
    function (): void {
      history.back();
    }
  );
  history.pushState({ sidePanel: "open" }, "title", "/admin/images");
  refreshLogin();
}
