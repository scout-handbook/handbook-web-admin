<script lang="ts" strictEvents>
  // eslint-disable-next-line no-undef
  type T = $$Generic;

  export let options: Array<[string, T]>;
  export let selected: Array<string>;

  interface $$Slots {
    default: { id: string; value: T };
  }
</script>

{#each options as [id, value]}
  <div class="form-row">
    <label class="form-switch">
      <input type="checkbox" value={id} bind:group={selected} />
      <span class="form-custom form-checkbox" />
      <slot {id} {value} />
    </label>
  </div>
{/each}
