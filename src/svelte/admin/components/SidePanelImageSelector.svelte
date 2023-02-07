<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { apiUri } from "../../../ts/admin/stores";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import Button from "./Button.svelte";
  import DoubleSidePanel from "./DoubleSidePanel.svelte";
  import LoadingIndicator from "./LoadingIndicator.svelte";
  import Pagination from "./Pagination.svelte";

  const dispatch = createEventDispatcher<{ cancel: never; select: string }>();

  let page = 1;
  const perPage = 15;

  // TODO: SWR?
  const imageListPromise = request<Array<string>>(
    $apiUri + "/v1.0/image",
    "GET",
    {},
    reAuthHandler
  );

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
      {#each imageList.slice(perPage * (page - 1), perPage * page) as image}
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
      <Pagination
        total={Math.ceil(imageList.length / perPage)}
        bind:current={page}
      />
    </div>
  {/await}
</DoubleSidePanel>
