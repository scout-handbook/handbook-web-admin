import { addField } from "../actions/addField";
import { changeField } from "../actions/changeField";
import { getElementsByClassName } from "../tools/getElementsByClassName";
import { reAuthHandler, request } from "../tools/request";
import { refreshLogin } from "../tools/refreshLogin";
import { RequestResponse } from "../interfaces/RequestResponse";
import { sidePanelDoubleOpen } from "./sidePanel";
import { SidePanelImageSelectorGlobalState } from "../interfaces/SidePanelImageSelectorGlobalState";

export let sidePanelImageSelectorState: SidePanelImageSelectorGlobalState | undefined =
  undefined;

export function openSidePanelImageSelector(
  action: string,
  property: string,
  state: Record<string, string>,
  page = 1,
  perPage = 15,
  noHistory = false
): void {
  sidePanelDoubleOpen();
  document.getElementById("side-panel")!.innerHTML =
    '<div id="embedded-spinner"></div>';
  request(
    CONFIG["api-uri"] + "/v1.0/image",
    "GET",
    {},
    function (response: RequestResponse): void {
      renderSidePanelImageSelector(
        response as Array<string>,
        action,
        property,
        state,
        page,
        perPage,
        noHistory
      );
    },
    reAuthHandler
  );
  refreshLogin();
}

export function closeSidePanelImageSelector(): void {
  switch (sidePanelImageSelectorState!.action) {
    case "addField":
      addField(sidePanelImageSelectorState!.state, true);
      break;
    case "changeField":
      changeField(sidePanelImageSelectorState!.state, true, true);
      break;
  }
  sidePanelImageSelectorState = undefined;
}

function renderSidePanelImageSelector(
  list: Array<string>,
  action: string,
  property: string,
  state: Record<string, string>,
  page: number,
  perPage: number,
  noHistory: boolean
): void {
  let html =
    '<div class="button yellow-button" id="fieldImageCancel"><i class="icon-cancel"></i>Zrušit</div><div class="field-image-container">';
  const start = perPage * (page - 1);
  for (let i = start; i < Math.min(list.length, start + perPage); i++) {
    html +=
      '<div class="thumbnail-container"><img src="' +
      CONFIG["api-uri"] +
      "/v1.0/image/" +
      list[i] +
      '?quality=thumbnail" class="thumbnail-image" data-id="' +
      list[i] +
      '"></div>';
  }
  if (list.length > perPage) {
    const maxPage = Math.ceil(list.length / perPage);
    html += '<div id="pagination">';
    if (page > 3) {
      html += '<div class="pagination-button" data-page="1">1</div> ... ';
    }
    if (page > 2) {
      html +=
        '<div class="pagination-button" data-page="' +
        (page - 2).toString() +
        '">' +
        (page - 2).toString() +
        "</div>";
    }
    if (page > 1) {
      html +=
        '<div class="pagination-button" data-page="' +
        (page - 1).toString() +
        '">' +
        (page - 1).toString() +
        "</div>";
    }
    html +=
      '<div class="pagination-button active">' + page.toString() + "</div>";
    if (page < maxPage) {
      html +=
        '<div class="pagination-button" data-page="' +
        (page + 1).toString() +
        '">' +
        (page + 1).toString() +
        "</div>";
    }
    if (page < maxPage - 1) {
      html +=
        '<div class="pagination-button" data-page="' +
        (page + 2).toString() +
        '">' +
        (page + 2).toString() +
        "</div>";
    }
    if (page < maxPage - 2) {
      html +=
        ' ... <div class="pagination-button" data-page="' +
        maxPage.toString() +
        '">' +
        maxPage.toString() +
        "</div>";
    }
    html += "</div>";
  }
  html += "</div>";
  document.getElementById("side-panel")!.innerHTML = html;

  document.getElementById("fieldImageCancel")!.onclick = function (): void {
    history.back();
  };
  const imageNodes = document
    .getElementById("side-panel")!
    .getElementsByTagName("img");
  for (let i = 0; i < imageNodes.length; i++) {
    imageNodes[i].onclick = function (event: MouseEvent): void {
      state[property] = (event.target as HTMLElement).dataset.id!;
      sidePanelImageSelectorState!.state = state;
      history.back();
    };
  }
  const buttonNodes = getElementsByClassName("pagination-button");
  for (let i = 0; i < buttonNodes.length; i++) {
    (buttonNodes[i] as HTMLElement).onclick = function (event): void {
      openSidePanelImageSelector(
        action,
        property,
        state,
        parseInt((event.target as HTMLElement).dataset.page!, 10),
        perPage,
        true
      );
    };
  }

  sidePanelImageSelectorState = { action, state };
  if (!noHistory) {
    history.pushState(
      { sidePanelImageSelector: "open" },
      "title",
      "/admin/lessons"
    );
  }
  refreshLogin();
}
