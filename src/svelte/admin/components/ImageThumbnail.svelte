<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { apiUri } from "../../../ts/admin/stores";

  export let id: string;

  const dispatch = createEventDispatcher<{ click: never }>();
</script>

<button
  type="button"
  on:click={() => {
    dispatch("click");
  }}
>
  <img
    alt={`Image ${id}`}
    src={`${$apiUri}/v1.0/image/${id}?quality=thumbnail`}
  />
</button>

<style>
  button {
    background-color: unset;
    border: none;
    cursor: pointer;
    padding: 0;
    vertical-align: middle;
  }

  img {
    transform: scale(0.9);
    transition: transform ease 0.15s;
  }

  img:hover {
    transform: scale(1);
  }
</style>
