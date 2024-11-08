<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { apiUri } from "$lib/stores";

  interface Props {
    name: string;
    onselect(this: void): void;
    value: string;
  }

  let { name, onselect, value }: Props = $props();
</script>

<label>
  <div>{name}:</div>
  <input type="hidden" {value} />
</label>
<img alt={name} src={`${$apiUri}/v1.0/image/${value}?quality=thumbnail`} />
<br />
<Button icon="pencil" on:click={onselect}>Změnit</Button>

<style>
  div {
    font-size: 1.1em;
    font-style: italic;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-top: 15px;
  }
</style>
