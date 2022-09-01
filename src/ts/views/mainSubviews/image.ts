/* global mainPageTab:true */
/* exported showImageSubview */

function showImagePreview(event: MouseEvent): void {
  const overlay = document.getElementById("overlay")!;
  overlay.style.display = "inline";
  overlay.style.cursor = "pointer";
  const html =
    '<img src="' +
    CONFIG["api-uri"] +
    "/v1.0/image/" +
    (event.target as HTMLElement).dataset.id! +
    '" class="preview-image">';
  overlay.innerHTML = html;
  overlay.onclick = function (): void {
    overlay.style.display = "none";
    overlay.style.cursor = "auto";
    overlay.innerHTML = "";
    overlay.onclick = null;
  };
}

function showImageList(
  list: Array<string>,
  page: number,
  perPage: number
): void {
  if (mainPageTab !== "images") {
    return;
  }
  let html = "";
  const start = perPage * (page - 1);
  for (let i = start; i < Math.min(list.length, start + perPage); i++) {
    html +=
      '<div class="thumbnail-container"><div class="button-container"><img src="' +
      CONFIG["api-uri"] +
      "/v1.0/image/" +
      list[i] +
      '?quality=thumbnail" class="thumbnail-image" data-id="' +
      list[i] +
      '"><div class="button red-button delete-image" data-id="' +
      list[i] +
      '"><i class="icon-trash-empty"></i>Smazat</div></div></div>';
  }
  html += renderPagination(Math.ceil(list.length / perPage), page);
  document.getElementById("imageList")!.innerHTML = html;

  const ImageNodes = document
    .getElementById("imageList")!
    .getElementsByTagName("img");
  for (let i = 0; i < ImageNodes.length; i++) {
    ImageNodes[i].onclick = showImagePreview;
  }
  const deleteNodes = getElementsByClassName("delete-image");
  for (let i = 0; i < deleteNodes.length; i++) {
    (deleteNodes[i] as HTMLElement).onclick = deleteImageOnClick;
  }
  const paginationNodes = getElementsByClassName("pagination-button");
  for (let i = 0; i < paginationNodes.length; i++) {
    (paginationNodes[i] as HTMLElement).onclick = function (event): void {
      downloadImageList(
        parseInt((event.target as HTMLElement).dataset.page!, 10),
        perPage
      );
    };
  }
}

function downloadImageList(page: number, perPage: number): void {
  document.getElementById("imageList")!.innerHTML =
    '<div id="embedded-spinner"></div>';
  request(
    CONFIG["api-uri"] + "/v1.0/image",
    "GET",
    {},
    function (response: RequestResponse): void {
      showImageList(response as Array<string>, page, perPage);
    },
    reAuthHandler
  );
  refreshLogin(true);
}

function showImageSubview(noHistory: boolean): void {
  mainPageTab = "images";
  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("image-manager")!.className += " active-top-bar-tab";
  let html = "<h1>" + CONFIG["site-name"] + " - Obrázky</h1>";
  html +=
    '<div class="button greenButton" id="addImage"><i class="icon-plus"></i>Nahrát</div>';
  html += '<div id="imageList"></div>';
  document.getElementById("main-page")!.innerHTML = html;

  document.getElementById("addImage")!.onclick = function (): void {
    addImage(false);
  };
  downloadImageList(1, 15);
  if (!noHistory) {
    history.pushState({ page: "images" }, "title", "/admin/images");
  }
}
