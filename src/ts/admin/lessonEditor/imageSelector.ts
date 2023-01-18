import { RequestResponse } from "../interfaces/RequestResponse";
import { refreshLogin } from "../tools/refreshLogin";
import { reAuthHandler, request } from "../tools/request";
import { editor } from "./editor";

export let imageSelectorOpen = false;

export function toggleImageSelector(): void {
  if (imageSelectorOpen) {
    document.getElementById("image-selector")!.style.top = "-100%";
  } else {
    document.getElementById("image-selector")!.style.top = "-76px";
  }
  imageSelectorOpen = !imageSelectorOpen;
  refreshLogin();
}

function insertImage(event: MouseEvent): void {
  const markdown =
    "![Text po najetí kurzorem](" +
    CONFIG["api-uri"] +
    "/v1.0/image/" +
    ((event.target as HTMLElement).dataset.id as string) +
    ")";
  const doc = editor.codemirror.getDoc();
  doc.replaceRange(markdown, doc.getCursor());
  toggleImageSelector();
  refreshLogin();
}

export function prepareImageSelector(page = 1, perPage = 15): void {
  request(
    CONFIG["api-uri"] + "/v1.0/image",
    "GET",
    {},
    function (response: RequestResponse): void {
      renderImageSelector(response as Array<string>, page, perPage);
    },
    reAuthHandler
  );
  refreshLogin();
}

function renderImageSelector(
  list: Array<string>,
  page: number,
  perPage: number
): void {
  if (!document.getElementById("image-wrapper")) {
    return;
  }
  let html = "";
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
  document.getElementById("image-wrapper")!.innerHTML = html;

  const imageNodes = document
    .getElementById("image-wrapper")!
    .getElementsByTagName("img");
  for (let i = 0; i < imageNodes.length; i++) {
    imageNodes[i].onclick = insertImage;
  }
  const buttonNodes = getElementsByClassName("pagination-button");
  for (let i = 0; i < buttonNodes.length; i++) {
    (buttonNodes[i] as HTMLElement).onclick = function (event): void {
      prepareImageSelector(
        parseInt((event.target as HTMLElement).dataset.page!, 10),
        perPage
      );
    };
  }
}

function getElementsByClassName(
  className: string,
  context: Document | Element = document
): HTMLCollection {
  if (context.getElementsByClassName) {
    return context.getElementsByClassName(className);
  }
  if (context.querySelectorAll) {
    return context.querySelectorAll(
      "." + className
    ) as unknown as HTMLCollection;
  }
  const all = context.getElementsByTagName("*");
  const ret = [];
  for (let i = 1; i < all.length; i++) {
    if (
      all[i].className &&
      (" " + all[i].className + " ").indexOf(" " + className + " ") >= 0 &&
      ret.indexOf(all[i]) < 0
    ) {
      ret.push(all[i]);
    }
  }
  return ret as unknown as HTMLCollection;
}
