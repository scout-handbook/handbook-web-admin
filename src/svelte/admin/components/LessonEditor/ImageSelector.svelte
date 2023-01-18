<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";
  import { apiUri } from "../../../../ts/admin/stores";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import { reAuthHandler, request } from "../../../../ts/admin/tools/request";
  import Button from "../../components/Button.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Pagination from "../Pagination.svelte";

  export let imageSelectorOpen: boolean;

  const dispatch = createEventDispatcher();

  let page = 1;
  const perPage = 15;
  $: pageStart = perPage * (page - 1);
  $: pageEnd = pageStart + perPage;

  const imageListPromise: Promise<Array<string>> = new Promise((resolve) => {
    request(
      $apiUri + "/v1.0/image",
      "GET",
      {},
      (response: RequestResponse): void => {
        resolve(response as Array<string>);
      },
      reAuthHandler
    );
  });

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
      {#await imageListPromise}
        <LoadingIndicator />
      {:then list}
        {#each list.slice(pageStart, pageEnd) as image}
          <div class="thumbnail-container">
            <img
              class="thumbnail-image"
              alt={"Image " + image}
              src={$apiUri + "/v1.0/image/" + image + "?quality=thumbnail"}
              on:click={() => {
                dispatch("insert", { image });
                imageSelectorOpen = false;
              }}
              on:keypress={() => {
                dispatch("insert", { image });
                imageSelectorOpen = false;
              }}
            />
          </div>
        {/each}
        <Pagination
          total={Math.ceil(list.length / perPage)}
          bind:current={page}
        />
      {/await}
    </div>
  </div>
</div>
