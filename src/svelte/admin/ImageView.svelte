<script lang="ts">
  import { onMount } from "svelte";

  import { addImage } from "../../ts/admin/actions/addImage";
  import { config } from "../../ts/admin/stores";
  import { deleteImageOnClick } from "../../ts/admin/actions/deleteImage";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { reAuthHandler, request } from "../../ts/admin/tools/request";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";
  import { RequestResponse } from "../../ts/admin/interfaces/RequestResponse";
  import { renderPagination } from "../../ts/admin/UI/pagination";
  import { showImagePreview } from "../../ts/admin/views/mainSubviews/image";

  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageListPromise: Promise<Array<string>> = new Promise((resolve) => {
    request(
      $config["api-uri"] + "/v1.0/image",
      "GET",
      {},
      function (response: RequestResponse): void {
        resolve(response as Array<string>);
      },
      reAuthHandler
    );
  });

  // TODO: Remove this horrible hack
  onMount(() => {
    const nodes = getElementsByClassName("top-bar-tab");
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].className = "top-bar-tab";
    }
    document.getElementById("image-manager")!.className +=
      " active-top-bar-tab";
  });

  // TODO: Remove this horrible hack
  function fixNavigation() {
    imageListPromise.then(() => {
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

  fixNavigation();
  refreshLogin(true);
</script>

<h1>{$config["site-name"] + " - Obrázky"}</h1>
<div
  id="addImage"
  class="button green-button"
  on:click={() => {
    addImage(false);
  }}
>
  <i class="icon-plus" />
  Nahrát
</div>
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
            src={$config["api-uri"] +
              "/v1.0/image/" +
              image +
              "?quality=thumbnail"}
            on:click={showImagePreview}
          />
          <div
            class="button red-button delete-image"
            data-id={image}
            on:click={deleteImageOnClick}
          >
            <i class="icon-trash-empty" />
            Smazat
          </div>
        </div>
      </div>
    {/each}
    {@html renderPagination(Math.ceil(list.length / perPage), page)}
  {/await}
</div>
