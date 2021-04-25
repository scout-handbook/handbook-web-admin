/* global imageSelectorOpen:true */

let imageSelectorOpen = false;

function toggleImageSelector(): void {
  if (imageSelectorOpen) {
    document.getElementById("imageSelector")!.style.top = "-100%";
  } else {
    document.getElementById("imageSelector")!.style.top = "-76px";
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

function prepareImageSelector(page = 1, perPage = 15): void {
  request(
    CONFIG["api-uri"] + "/v1.0/image",
    "GET",
    {},
    function (response: RequestResponse): void {
      renderImageSelector(
        (response as unknown) as Array<string>,
        page,
        perPage
      ); // eslint-disable-line @typescript-eslint/no-use-before-define
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
  if (!document.getElementById("imageWrapper")) {
    return;
  }
  let html = "";
  const start = perPage * (page - 1);
  for (let i = start; i < Math.min(list.length, start + perPage); i++) {
    html +=
      '<div class="thumbnailContainer"><img src="' +
      CONFIG["api-uri"] +
      "/v1.0/image/" +
      list[i] +
      '?quality=thumbnail" class="thumbnailImage" data-id="' +
      list[i] +
      '"></div>';
  }
  if (list.length > perPage) {
    const maxPage = Math.ceil(list.length / perPage);
    html += '<div id="pagination">';
    if (page > 3) {
      html += '<div class="paginationButton" data-page="1">1</div> ... ';
    }
    if (page > 2) {
      html +=
        '<div class="paginationButton" data-page="' +
        (page - 2).toString() +
        '">' +
        (page - 2).toString() +
        "</div>";
    }
    if (page > 1) {
      html +=
        '<div class="paginationButton" data-page="' +
        (page - 1).toString() +
        '">' +
        (page - 1).toString() +
        "</div>";
    }
    html +=
      '<div class="paginationButton active">' + page.toString() + "</div>";
    if (page < maxPage) {
      html +=
        '<div class="paginationButton" data-page="' +
        (page + 1).toString() +
        '">' +
        (page + 1).toString() +
        "</div>";
    }
    if (page < maxPage - 1) {
      html +=
        '<div class="paginationButton" data-page="' +
        (page + 2).toString() +
        '">' +
        (page + 2).toString() +
        "</div>";
    }
    if (page < maxPage - 2) {
      html +=
        ' ... <div class="paginationButton" data-page="' +
        maxPage.toString() +
        '">' +
        maxPage.toString() +
        "</div>";
    }
    html += "</div>";
  }
  document.getElementById("imageWrapper")!.innerHTML = html;

  const imageNodes = document
    .getElementById("imageWrapper")!
    .getElementsByTagName("img");
  for (let i = 0; i < imageNodes.length; i++) {
    imageNodes[i].onclick = insertImage;
  }
  const buttonNodes = getElementsByClassName("paginationButton");
  for (let i = 0; i < buttonNodes.length; i++) {
    (buttonNodes[i] as HTMLElement).onclick = function (event): void {
      prepareImageSelector(
        parseInt((event.target as HTMLElement).dataset.page!, 10),
        perPage
      );
    };
  }
}
