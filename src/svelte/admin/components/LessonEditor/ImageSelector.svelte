<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { createEventDispatcher } from "svelte";

  import Button from "../../components/Button.svelte";
  import ImageGridCell from "../ImageGridCell.svelte";
  import ImageThumbnail from "../ImageThumbnail.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Pagination from "../Pagination.svelte";

  export let imageSelectorOpen: boolean;

  const dispatch = createEventDispatcher<{ insert: string }>();

  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageQuery = createQuery<Array<string>>({
    queryKey: ["v1.0", "image"],
  });
  $: totalImageCount = $imageQuery.data?.length;
  $: currentPageList = $imageQuery.data?.slice(pageStart, pageEnd);
</script>

<div class="selector" class:selector-open={imageSelectorOpen}>
  <div class="button-wrapper">
    <Button
      icon="up-open"
      yellow
      on:click={() => {
        imageSelectorOpen = false;
      }}>Zavřít</Button
    >
    <!-- TODO: Re-enable uploads in editor without discarding its contents
    <Button
      icon="plus"
      green
      on:click={() => {
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
              on:click={() => {
                dispatch("insert", image);
                imageSelectorOpen = false;
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
