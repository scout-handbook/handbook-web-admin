<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import DoubleSidePanel from "$lib/components/DoubleSidePanel.svelte";
  import ImageGridCell from "$lib/components/ImageGridCell.svelte";
  import ImageThumbnail from "$lib/components/ImageThumbnail.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  interface Props {
    oncancel(this: void): void;
    onselect(this: void, id: string): void;
  }

  let { oncancel, onselect }: Props = $props();

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

<DoubleSidePanel>
  {#if currentPageList === undefined || totalImageCount === undefined}
    <LoadingIndicator />
  {:else}
    <Button icon="cancel" onclick={oncancel} yellow>Zrušit</Button>
    <div class="container">
      {#each currentPageList as image (image)}
        <ImageGridCell>
          <ImageThumbnail
            id={image}
            onclick={() => {
              onselect(image);
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
