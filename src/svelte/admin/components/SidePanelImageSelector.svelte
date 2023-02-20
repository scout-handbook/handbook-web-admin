<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { createEventDispatcher } from "svelte";

  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
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

  const imageList = useSWR<Array<string>>(constructURL("v1.0/image")).data;
  $: totalImageCount = $imageList?.length;
  $: currentPageList = $imageList?.slice(pageStart, pageEnd);

  refreshLogin();
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
    <div class="field-image-container">
      {#each currentPageList as image}
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
