<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import { apiUri } from "../../../../ts/admin/stores";
  import Button from "../Button.svelte";

  export let name: string;
  export let value: string;

  const dispatch = createEventDispatcher<{ select: never }>();
</script>

<label>
  <div>{name}:</div>
  <input type="hidden" {value} />
</label>
<img alt={name} src={`${$apiUri}/v1.0/image/${value}?quality=thumbnail`} />
<br />
<Button
  icon="pencil"
  on:click={() => {
    dispatch("select");
  }}>Změnit</Button
>

<style>
  div {
    font-size: 1.1em;
    font-style: italic;
    margin-bottom: 5px;
    margin-left: 5px;
    margin-top: 15px;
  }
</style>
