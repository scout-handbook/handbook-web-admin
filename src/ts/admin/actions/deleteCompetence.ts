import { Action } from "../tools/Action";
import { ActionQueue } from "../tools/ActionQueue";
import { COMPETENCES } from "../metadata";
import { dialog } from "../UI/dialog";
import { refreshLogin } from "../tools/refreshLogin";

export function deleteCompetenceOnClick(id: string): void {
  const competence = COMPETENCES.get(id)!;
  const aq = new ActionQueue([
    new Action(
      CONFIG["api-uri"] + "/v1.0/competence/" + encodeURIComponent(id),
      "DELETE"
    ),
  ]);
  dialog(
    "Opravdu si přejete smazat kompetenci " +
      competence.number.toString() +
      ': "' +
      competence.name +
      '"?',
    "Ano",
    () => aq.closeDispatch(),
    "Ne",
    function (): void {
      history.back();
    }
  );
  history.pushState({ sidePanel: "open" }, "title", "/admin/competences");
  refreshLogin();
}
