import { Action } from "../tools/Action";
import { ActionQueue } from "../tools/ActionQueue";
import { dialog } from "../UI/dialog";
import { refreshLogin } from "../tools/refreshLogin";

export function deleteImageOnClick(id: string): void {
  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/image/" + encodeURIComponent(id),
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
