<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { createEventDispatcher } from "svelte";

  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
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

  const imageList = useSWR<Array<string>>(constructURL("v1.0/image")).data;
  $: totalImageCount = $imageList?.length;
  $: currentPageList = $imageList?.slice(pageStart, pageEnd);

  refreshLogin();
</script>

<div style:top={imageSelectorOpen ? "-76px" : "-100%"} class="selector">
  <div class="scroller">
    <div class="close-button-wrapper">
      <Button
        icon="up-open"
        yellow
        on:click={() => {
          imageSelectorOpen = false;
        }}>Zavřít</Button
      >
    </div>
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
    <div class="wrapper">
      {#if currentPageList === undefined || totalImageCount === undefined}
        <LoadingIndicator />
      {:else}
        {#each currentPageList as image}
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
  .close-button-wrapper {
    margin-left: 19px;
    margin-top: 19px;
  }

  .scroller {
    bottom: 0;
    left: 0;
    overflow-y: auto;
    padding-bottom: 30px;
    position: absolute;
    right: 0;
    top: 76px;
  }

  .selector {
    background-color: #fff;
    height: 100%;
    position: relative;
    top: -100%;
    transition: top 0.4s ease;
    z-index: 7;
  }

  .wrapper {
    margin: 0 auto;
    max-width: 770px;
  }
</style>
