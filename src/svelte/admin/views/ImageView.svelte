<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import { apiUri, siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/utils/constructURL";
  import AddImagePanel from "../components/action-modals/AddImagePanel.svelte";
  import DeleteImageDialog from "../components/action-modals/DeleteImageDialog.svelte";
  import Button from "../components/Button.svelte";
  import ImageGridCell from "../components/ImageGridCell.svelte";
  import ImageThumbnail from "../components/ImageThumbnail.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Overlay from "../components/Overlay.svelte";
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

  let openImage: string | null = null;
  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageList = useSWR<Array<string>>(constructURL("v1.0/image")).data;
  $: totalImageCount = $imageList?.length;
  $: currentPageList = $imageList?.slice(pageStart, pageEnd);
</script>

{#if action === "add-image"}
  <AddImagePanel />
{:else if action === "delete-image"}
  <DeleteImageDialog payload={actionPayload} />
{/if}

{#if openImage !== null}
  <Overlay
    on:click={() => {
      openImage = null;
    }}
  />
  <img
    class="image-preview"
    alt={"Image " + openImage}
    src={$apiUri + "/v1.0/image/" + openImage}
    on:click={() => {
      openImage = null;
    }}
    on:keypress={() => {
      openImage = null;
    }}
  />
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
<br />
{#if currentPageList === undefined || totalImageCount === undefined}
  <LoadingIndicator />
{:else}
  {#each currentPageList as image}
    <ImageGridCell>
      <ImageThumbnail
        id={image}
        on:click={() => {
          openImage = image;
        }}
      />
      <div class="delete-image">
        <Button
          icon="trash-empty"
          red
          on:click={() => {
            navigate("/images", {
              state: {
                action: "delete-image",
                actionPayload: { imageId: image },
              },
            });
          }}
        >
          Smazat
        </Button>
      </div>
    </ImageGridCell>
  {/each}
  <Pagination
    total={Math.ceil(totalImageCount / perPage)}
    bind:current={page}
  />
{/if}

<style>
  .delete-image {
    bottom: 5%;
    margin-bottom: 9px;
    margin-right: -9px;
    position: absolute;
    right: 5%;
  }

  .image-preview {
    cursor: pointer;
    bottom: 0;
    left: 0;
    margin: auto;
    max-height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9;
  }
</style>
