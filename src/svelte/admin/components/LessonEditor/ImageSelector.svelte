<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { createEventDispatcher } from "svelte";

  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../../components/Button.svelte";
  import ImageThumbnail from "../ImageThumbnail.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Pagination from "../Pagination.svelte";

  export let imageSelectorOpen: boolean;

  const dispatch = createEventDispatcher<{ insert: string }>();

  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageList = useSWR<Array<string>>(constructURL("v1.0/image")).data;
  $: totalImageCount = $imageList?.length;
  $: currentPageList = $imageList?.slice(pageStart, pageEnd);

  refreshLogin();
</script>

<div id="image-selector" style:top={imageSelectorOpen ? "-76px" : "-100%"}>
  <div id="image-scroller">
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
    <div id="image-wrapper">
      {#if currentPageList === undefined || totalImageCount === undefined}
        <LoadingIndicator />
      {:else}
        {#each currentPageList as image}
          <div class="thumbnail-container">
            <ImageThumbnail
              id={image}
              on:click={() => {
                dispatch("insert", image);
                imageSelectorOpen = false;
              }}
            />
          </div>
        {/each}
        <Pagination
          total={Math.ceil(totalImageCount / perPage)}
          bind:current={page}
        />
      {/if}
    </div>
  </div>
</div>
