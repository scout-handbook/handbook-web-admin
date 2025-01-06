<script lang="ts">
  import { pushState } from "$app/navigation";
  import { page as kitPage } from "$app/state";
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
  import { createQuery } from "@tanstack/svelte-query";

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
  {#if kitPage.state.action.name === "add-image"}
    <AddImagePanel />
  {:else if kitPage.state.action.name === "delete-image"}
    <DeleteImageDialog imageId={kitPage.state.action.imageId} />
  {/if}

  {#if openImage !== null}
    <Overlay
      onclick={(): void => {
        openImage = null;
      }}
    />
    <button
      onclick={(): void => {
        openImage = null;
      }}
      type="button"
    >
      <img
        alt={`Image ${openImage}`}
        src={`${CONFIG["api-uri"]}/v1.0/image/${openImage}`}
      />
    </button>
  {/if}
  <h1>{`${CONFIG["site-name"]} - Obrázky`}</h1>
  <Button
    green
    icon="plus"
    onclick={(): void => {
      pushState("", { action: { name: "add-image" } });
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
          onclick={(): void => {
            openImage = image;
          }}
        />
        <div class="delete-image">
          <Button
            icon="trash-empty"
            onclick={(): void => {
              pushState("", {
                action: {
                  imageId: image,
                  name: "delete-image",
                },
              });
            }}
            red
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
    width: fit-content;
    left: 0;
    padding: 0;
    margin: auto;
    max-height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9;
  }

  img {
    display: block;
  }
</style>
