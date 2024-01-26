<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { page as kitPage } from "$app/stores";
  import AddImagePanel from "$lib/components/action-modals/AddImagePanel.svelte";
  import DeleteImageDialog from "$lib/components/action-modals/DeleteImageDialog.svelte";
  import Button from "$lib/components/Button.svelte";
  import ImageGridCell from "$lib/components/ImageGridCell.svelte";
  import ImageThumbnail from "$lib/components/ImageThumbnail.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { apiUri, siteName } from "$lib/stores";
  import { constructURL } from "$lib/utils/constructURL";

  import type { PageStateFix } from "../../app";

  $: state = $kitPage.state as PageStateFix;

  let openImage: string | null = null;
  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageList = useSWR<Array<string>>(constructURL("v1.0/image")).data;
  $: totalImageCount = $imageList?.length;
  $: currentPageList = $imageList?.slice(pageStart, pageEnd);
</script>

{#if state.action === "add-image"}
  <AddImagePanel />
{:else if state.action === "delete-image"}
  <DeleteImageDialog payload={state.actionPayload} />
{/if}

{#if openImage !== null}
  <Overlay
    on:click={() => {
      openImage = null;
    }}
  />
  <button
    type="button"
    on:click={() => {
      openImage = null;
    }}
  >
    <img
      alt={"Image " + openImage}
      src={$apiUri + "/v1.0/image/" + openImage}
    />
  </button>
{/if}
<h1>{$siteName + " - Obrázky"}</h1>
<Button
  green
  icon="plus"
  on:click={() => {
    void goto(base + "/images", { state: { action: "add-image" } });
  }}
>
  Nahrát
</Button>
<br />
{#if currentPageList === undefined || totalImageCount === undefined}
  <LoadingIndicator />
{:else}
  {#each currentPageList as image (image)}
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
            void goto(base + "/images", {
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

  button {
    border: none;
    cursor: pointer;
    bottom: 0;
    height: fit-content;
    left: 0;
    padding: 0;
    margin: auto;
    max-height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9;
  }
</style>
