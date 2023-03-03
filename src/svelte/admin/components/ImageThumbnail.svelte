<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { apiUri } from "../../../ts/admin/stores";

  export let id: string;

  const dispatch = createEventDispatcher<{ click: never }>();
</script>

<img
  alt={"Image " + id}
  src={$apiUri + "/v1.0/image/" + id + "?quality=thumbnail"}
  on:click={() => {
    dispatch("click");
  }}
  on:keypress={() => {
    dispatch("click");
  }}
/>

<style>
  img {
    cursor: pointer;
    transform: scale(0.9);
    transition: transform ease 0.15s;
    vertical-align: middle;
  }

  img:hover {
    transform: scale(1);
  }
</style>
