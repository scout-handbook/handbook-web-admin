<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import ImageGridCell from "$lib/components/ImageGridCell.svelte";
  import ImageThumbnail from "$lib/components/ImageThumbnail.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  interface Props {
    closeImageSelector(this: void): void;
    imageSelectorOpen: boolean;
    oninsert(this: void, id: string): void;
  }

  let { closeImageSelector, imageSelectorOpen, oninsert }: Props = $props();

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

<div class="selector" class:selector-open={imageSelectorOpen}>
  <div class="button-wrapper">
    <Button icon="up-open" onclick={closeImageSelector} yellow>Zavřít</Button>
    <!-- TODO: Re-enable uploads in editor without discarding its contents
    <Button
      green
      icon="plus"
      onclick={() => {
        addImage(true); // Removed
      }}>
      Nahrát
    </Button>
    -->
  </div>
  <div class="scroller">
    <div class="container">
      {#if currentPageList === undefined || totalImageCount === undefined}
        <LoadingIndicator />
      {:else}
        {#each currentPageList as image (image)}
          <ImageGridCell>
            <ImageThumbnail
              id={image}
              onclick={(): void => {
                oninsert(image);
                closeImageSelector();
              }}
            />
          </ImageGridCell>
        {/each}
        <Pagination
          total={Math.ceil(totalImageCount / perPage)}
          bind:current={page}
        />
      {/if}
    </div>
  </div>
</div>

<style>
  .button-wrapper {
    margin-left: 15px;
    margin-top: 95px;
    position: absolute;
    z-index: 8;
  }

  .scroller {
    bottom: 0;
    left: 0;
    overflow-y: auto;
    padding-bottom: 30px;
    padding-top: 76px;
    position: absolute;
    right: 0;
    top: 0;
  }

  .selector {
    background-color: #fff;
    height: 100%;
    position: fixed;
    top: -100%;
    transition: top 0.4s ease;
    width: 100%;
    z-index: 7;
  }

  .selector-open {
    top: 0;
  }

  .container {
    margin: 0 auto;
    max-width: 770px;
  }
</style>
