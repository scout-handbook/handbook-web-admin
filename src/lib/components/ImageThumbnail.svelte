<script lang="ts">
  import { apiUri } from "$lib/stores";

  interface Props {
    id: string;
    onclick(this: void): void;
  }

  let { id, onclick }: Props = $props();
</script>

<button
  {onclick}
  type="button"
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
