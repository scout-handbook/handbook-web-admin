<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import AddImagePanel from "../components/action-modals/AddImagePanel.svelte";
  import { apiUri, siteName } from "../../../ts/admin/stores";
  import Button from "../components/Button.svelte";
  import DeleteImageDialog from "../components/action-modals/DeleteImageDialog.svelte";
  import Pagination from "../components/Pagination.svelte";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";

  const location = useLocation();
  const navigate = useNavigate();
  $: action = $location.state?.action as string | null;
  $: actionPayload = $location.state?.actionPayload as { imageId: string };

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

  refreshLogin(true);
</script>

{#if action === "add-image"}
  <AddImagePanel />
{:else if action === "delete-image"}
  <DeleteImageDialog payload={actionPayload} />
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
              navigate("/images", {
                state: { actionPayload: { imageId: image } },
              });
            }}
          >
            Smazat
          </Button>
        </div>
      </div>
    {/each}
    <Pagination total={Math.ceil(list.length / perPage)} bind:current={page} />
  {/await}
</div>
