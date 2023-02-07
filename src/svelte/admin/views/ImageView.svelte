<script lang="ts" strictEvents>
  import { useLocation, useNavigate } from "svelte-navigator";

  import { apiUri, siteName } from "../../../ts/admin/stores";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import AddImagePanel from "../components/action-modals/AddImagePanel.svelte";
  import DeleteImageDialog from "../components/action-modals/DeleteImageDialog.svelte";
  import Button from "../components/Button.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Pagination from "../components/Pagination.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { imageId: string };
  }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  // TODO: SWR
  const imageListPromise: Promise<Array<string>> = request(
    $apiUri + "/v1.0/image",
    "GET",
    {},
    reAuthHandler
  );

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
    <LoadingIndicator />
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
