<script lang="ts" strictEvents>
  export let options: Array<[string, string]>;
  export let selected: Array<string>;
</script>

{#each options as [id, name]}
  <div class="form-row">
    <label class="form-switch">
      <input type="checkbox" value={id} bind:group={selected} />
      <span class="form-custom form-checkbox" />
      {#if id === "00000000-0000-0000-0000-000000000000"}
        <span class="special">{name}</span>
      {:else}
        {name}
      {/if}
    </label>
  </div>
{/each}

<style>
  .special {
    font-style: italic;
  }
</style>
