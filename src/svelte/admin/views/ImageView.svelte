<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import AddImagePanel from "../components/action-modals/AddImagePanel.svelte";
  import { apiUri, siteName } from "../../../ts/admin/stores";
  import Button from "../components/Button.svelte";
  import { deleteImageOnClick } from "../../../ts/admin/actions/deleteImage";
  import { getElementsByClassName } from "../../../ts/admin/tools/getElementsByClassName";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { renderPagination } from "../../../ts/admin/UI/pagination";

  const location = useLocation();
  const navigate = useNavigate();
  $: action = $location.state?.action;

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

  function showImagePreview(id: string): void {
    const overlay = document.getElementById("overlay")!;
    overlay.style.display = "inline";
    overlay.style.cursor = "pointer";
    const html =
      '<img src="' + $apiUri + "/v1.0/image/" + id + '" class="preview-image">';
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

{#if action === "add-image"}
  <AddImagePanel />
{/if}

<h1>{$siteName + " - Obrázky"}</h1>
<Button
  green
  icon="plus"
  on:click={() => {
    navigate("/images", { state: { action: "add-image" } });
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
            src={$apiUri + "/v1.0/image/" + image + "?quality=thumbnail"}
            on:click={() => {
              showImagePreview(image);
            }}
            on:keypress={() => {
              showImagePreview(image);
            }}
          />
          <Button
            icon="trash-empty"
            red
            on:click={() => {
              deleteImageOnClick(image);
            }}
          >
            Smazat
          </Button>
        </div>
      </div>
    {/each}
    {@html renderPagination(Math.ceil(list.length / perPage), page)}
  {/await}
</div>
