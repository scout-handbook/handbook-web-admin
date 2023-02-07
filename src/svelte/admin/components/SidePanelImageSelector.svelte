<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { apiUri } from "../../../ts/admin/stores";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import Button from "./Button.svelte";
  import DoubleSidePanel from "./DoubleSidePanel.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";

  const dispatch = createEventDispatcher<{ cancel: never; select: string }>();

  let page = 1;
  const perPage = 15;

  let imageListPromise: Promise<Array<string>>;

  // TODO: Reactive variable?
  // TODO: SWR?
  function reload(): void {
    imageListPromise = request<Array<string>>(
      $apiUri + "/v1.0/image",
      "GET",
      {},
      reAuthHandler
    ).then((response) => response.slice(perPage * (page - 1), perPage * page));
  }

  reload();
  refreshLogin();
</script>

<DoubleSidePanel>
  {#await imageListPromise}
    <LoadingIndicator />
  {:then imageList}
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        dispatch("cancel");
      }}>Zrušit</Button
    >
    <div class="field-image-container">
      {#each imageList as image}
        <div class="thumbnail-container">
          <img
            class="thumbnail-image"
            alt={"Image " + image}
            src={$apiUri + "/v1.0/image/" + image + "?quality=thumbnail"}
            on:click={() => {
              dispatch("select", image);
            }}
            on:keypress={() => {
              dispatch("select", image);
            }}
          />
        </div>
      {/each}
      {#if imageList.length > perPage}
        <div id="pagination">
          {#if page > 3}
            <div
              class="pagination-button"
              on:click={() => {
                page = 1;
                reload();
              }}
              on:keypress={() => {
                page = 1;
                reload();
              }}
            >
              1
            </div>
            ...
          {/if}
          {#if page > 2}
            <div
              class="pagination-button"
              on:click={() => {
                page = page - 2;
                reload();
              }}
              on:keypress={() => {
                page = page - 2;
                reload();
              }}
            >
              {page - 2}
            </div>
          {/if}
          {#if page > 1}
            <div
              class="pagination-button"
              on:click={() => {
                page = page - 1;
                reload();
              }}
              on:keypress={() => {
                page = page - 1;
                reload();
              }}
            >
              {page - 1}
            </div>
          {/if}
          <div class="pagination-button active">{page}</div>
          {#if page < Math.ceil(imageList.length / perPage)}
            <div
              class="pagination-button"
              on:click={() => {
                page = page + 1;
                reload();
              }}
              on:keypress={() => {
                page = page + 1;
                reload();
              }}
            >
              {page + 1}
            </div>
          {/if}
          {#if page < Math.ceil(imageList.length / perPage) - 1}
            <div
              class="pagination-button"
              on:click={() => {
                page = page + 2;
                reload();
              }}
              on:keypress={() => {
                page = page + 2;
                reload();
              }}
            >
              {page + 2}
            </div>
          {/if}
          {#if page < Math.ceil(imageList.length / perPage) - 2}
            ... <div
              class="pagination-button"
              on:click={() => {
                page = Math.ceil(imageList.length / perPage);
                reload();
              }}
              on:keypress={() => {
                page = Math.ceil(imageList.length / perPage);
                reload();
              }}
            >
              {Math.ceil(imageList.length / perPage)}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/await}
</DoubleSidePanel>
