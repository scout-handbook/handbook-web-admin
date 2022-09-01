/* exported addImage */

function addImageSave(): void {
  if (
    (document.getElementById("addImageFile") as HTMLInputElement).value !== ""
  ) {
    if (!FormData) {
      dialog("Tento prohlížeč nepodporuje nahrávání souborů", "OK");
    }
    const formData = new FormData();
    formData.append(
      "image",
      (document.getElementById("addImageFile") as HTMLInputElement).files![0]
    );
    sidePanelClose();
    spinner();
    request(
      CONFIG["api-uri"] + "/v1.0/image",
      "POST",
      formData,
      function (): void {
        dialog("Akce byla úspěšná.", "OK");
        refreshMetadata();
        history.back();
      },
      authFailHandler
    );
  }
}

function changeLabel(event: Event): void {
  const element = event.target as HTMLInputElement;
  if (element.files) {
    element.parentElement!.children[1].innerHTML =
      '<i class="icon-upload"></i>' + element.files[0].name;
  }
}

function addImage(inEditor: boolean): void {
  sidePanelOpen();
  let html =
    '<div class="button yellow-button" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button greenButton" id="addImageSave"><i class="icon-floppy"></i>Uložit</div>';
  html +=
    '<h3 class="side-panel-title">Nahrát obrázek</h3><form id="side-panel-form">';
  html += '<div class="form-row"><label class="form-file">';
  html += '<input type="file" class="form-file" id="addImageFile">';
  html +=
    '<div class="button"><i class="icon-upload"></i>Vybrat soubor</div></label>';
  html += "</div></form>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };
  document.getElementById("addImageSave")!.onclick = addImageSave;

  document.getElementById("addImageFile")!.onchange = changeLabel;

  if (inEditor) {
    history.pushState({ sidePanel: "open" }, "title", "/admin/lessons");
  } else {
    history.pushState({ sidePanel: "open" }, "title", "/admin/images");
  }
  refreshLogin();
}
