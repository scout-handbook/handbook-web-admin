<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { createEventDispatcher } from "svelte";

  import Button from "$lib/components/Button.svelte";
  import DoubleSidePanel from "$lib/components/DoubleSidePanel.svelte";
  import ImageGridCell from "$lib/components/ImageGridCell.svelte";
  import ImageThumbnail from "$lib/components/ImageThumbnail.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import { constructURL } from "$lib/utils/constructURL";

  const dispatch = createEventDispatcher<{ cancel: never; select: string }>();

  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageList = useSWR<Array<string>>(constructURL("v1.0/image")).data;
  $: totalImageCount = $imageList?.length;
  $: currentPageList = $imageList?.slice(pageStart, pageEnd);
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
