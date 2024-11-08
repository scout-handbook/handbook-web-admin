<script lang="ts">
  import { pushState } from "$app/navigation";
  import { page as kitPage } from "$app/stores";
  import AddImagePanel from "$lib/components/action-modals/AddImagePanel.svelte";
  import DeleteImageDialog from "$lib/components/action-modals/DeleteImageDialog.svelte";
  import Button from "$lib/components/Button.svelte";
  import ImageGridCell from "$lib/components/ImageGridCell.svelte";
  import ImageThumbnail from "$lib/components/ImageThumbnail.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { apiUri, siteName } from "$lib/stores";
  import { createQuery } from "@tanstack/svelte-query";

  import type { PageStateFix } from "../../app";

  let pageState = $derived($kitPage.state as PageStateFix);

  let openImage: string | null = $state(null);
  let page = $state(1);
  const perPage = 15;
  let pageStart = $derived(perPage * (page - 1));
  let pageEnd = $derived(pageStart + perPage);

  const imageQuery = createQuery<Array<string>>({
    queryKey: ["v1.0", "image"],
  });
  let totalImageCount = $derived($imageQuery.data?.length);
  let currentPageList = $derived($imageQuery.data?.slice(pageStart, pageEnd));
</script>

<TopBar />
<MainPageContainer>
  {#if pageState.action === "add-image"}
    <AddImagePanel />
  {:else if pageState.action === "delete-image"}
    <DeleteImageDialog payload={pageState.actionPayload} />
  {/if}

  {#if openImage !== null}
    <Overlay
      onclick={() => {
        openImage = null;
      }}
    />
    <button
      onclick={() => {
        openImage = null;
      }}
      type="button"
    >
      <img
        alt={`Image ${openImage}`}
        src={`${$apiUri}/v1.0/image/${openImage}`}
      />
    </button>
  {/if}
  <h1>{`${$siteName} - Obrázky`}</h1>
  <Button
    green
    icon="plus"
    on:click={() => {
      pushState("", { action: "add-image" });
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
              pushState("", {
                action: "delete-image",
                actionPayload: { imageId: image },
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
</MainPageContainer>

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
