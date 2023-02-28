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
      <span class="form-custom" />
      <slot {id} {value} />
    </label>
  </div>
{/each}

<style>
  span {
    border-radius: 3px;
  }

  span::before {
    border: 3px solid var(--border-color);
    border-right: none;
    border-top: none;
    height: 4px;
    margin-left: 2px;
    margin-top: 3px;
    transform: rotate(-45deg);
    transition: border-color ease 0.15s;
    width: 8px;
  }

  span:hover::before {
    border-color: var(--accent-color);
  }

  input:checked + span::before {
    border-color: var(--accent-color);
  }
</style>
