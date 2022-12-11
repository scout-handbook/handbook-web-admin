<script lang="ts">
  import { addImage } from "../../../ts/admin/actions/addImage";
  import { apiUri, siteName } from "../../../ts/admin/stores";
  import Button from "../components/Button.svelte";
  import { deleteImageOnClick } from "../../../ts/admin/actions/deleteImage";
  import { getElementsByClassName } from "../../../ts/admin/tools/getElementsByClassName";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { renderPagination } from "../../../ts/admin/UI/pagination";

  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageListPromise: Promise<Array<string>> = new Promise((resolve) => {
    request(
      $apiUri + "/v1.0/image",
      "GET",
      {},
      function (response: RequestResponse): void {
        resolve(response as Array<string>);
      },
      reAuthHandler
    );
  });

  // TODO: Remove this horrible hack
  function fixNavigation() {
    void imageListPromise.then(() => {
      setTimeout(() => {
        const paginationNodes = getElementsByClassName("pagination-button");
        for (let i = 0; i < paginationNodes.length; i++) {
          (paginationNodes[i] as HTMLElement).onclick = function (event): void {
            page = parseInt((event.target as HTMLElement).dataset.page!, 10);
            fixNavigation();
          };
        }
      }, 100);
    });
  }

  function showImagePreview(event: MouseEvent): void {
    const overlay = document.getElementById("overlay")!;
    overlay.style.display = "inline";
    overlay.style.cursor = "pointer";
    const html =
      '<img src="' +
      $apiUri +
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

  fixNavigation();
  refreshLogin(true);
</script>

<h1>{$siteName + " - Obrázky"}</h1>
<Button
  icon="plus"
  green
  on:click={() => {
    addImage(false);
  }}
>
  Nahrát
</Button>
<div id="imageList">
  {#await imageListPromise}
    <div id="embedded-spinner" />
  {:then list}
    {#each list.slice(pageStart, pageEnd) as image}
      <div class="thumbnail-container">
        <div class="button-container">
          <img
            class="thumbnail-image"
            alt={"Image " + image}
            data-id={image}
            src={$apiUri + "/v1.0/image/" + image + "?quality=thumbnail"}
            on:click={showImagePreview}
            on:keypress={showImagePreview}
          />
          <Button
            icon="trash-empty"
            red
            on:click={() => {deleteImageOnClick(image);}}
          >
            Smazat
          </Button>
        </div>
      </div>
    {/each}
    {@html renderPagination(Math.ceil(list.length / perPage), page)}
  {/await}
</div>
