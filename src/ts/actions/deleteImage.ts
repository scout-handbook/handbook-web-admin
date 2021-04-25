/* exported deleteImageOnClick */

function deleteImageOnClick(event: MouseEvent): void {
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
  history.pushState({ sidePanel: "open" }, "title", "/admin/images"); // eslint-disable-line compat/compat
  refreshLogin();
}
