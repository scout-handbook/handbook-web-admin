<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";
  import { createEventDispatcher } from "svelte";

  import Button from "./Button.svelte";
  import DoubleSidePanel from "./DoubleSidePanel.svelte";
  import ImageGridCell from "./ImageGridCell.svelte";
  import ImageThumbnail from "./ImageThumbnail.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import Pagination from "./Pagination.svelte";

  const dispatch = createEventDispatcher<{ cancel: never; select: string }>();

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

<DoubleSidePanel>
  {#if currentPageList === undefined || totalImageCount === undefined}
    <LoadingIndicator />
  {:else}
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        dispatch("cancel");
      }}>Zrušit</Button
    >
    <div class="container">
      {#each currentPageList as image (image)}
        <ImageGridCell>
          <ImageThumbnail
            id={image}
            on:click={() => {
              dispatch("select", image);
            }}
          />
        </ImageGridCell>
      {/each}
      <Pagination
        total={Math.ceil(totalImageCount / perPage)}
        bind:current={page}
      />
    </div>
  {/if}
</DoubleSidePanel>

<style>
  .container {
    margin: 0 auto 30px;
    max-width: 770px;
  }
</style>
