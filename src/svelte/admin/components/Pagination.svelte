<script lang="ts" strictEvents>
  export let current: number;
  export let total: number;
</script>

{#if total > 1}
  <div class="container">
    {#if current > 3}
      <div
        class="button"
        on:click={() => {
          current = 1;
        }}
        on:keypress={() => {
          current = 1;
        }}
      >
        1
      </div>
      ...
    {/if}
    {#if current > 2}
      <div
        class="button"
        on:click={() => {
          current -= 2;
        }}
        on:keypress={() => {
          current -= 2;
        }}
      >
        {current - 2}
      </div>
    {/if}
    {#if current > 1}
      <div
        class="button"
        on:click={() => {
          current -= 1;
        }}
        on:keypress={() => {
          current -= 1;
        }}
      >
        {current - 1}
      </div>
    {/if}
    <div class="button active">
      {current}
    </div>
    {#if current < total}
      <div
        class="button"
        on:click={() => {
          current += 1;
        }}
        on:keypress={() => {
          current += 1;
        }}
      >
        {current + 1}
      </div>
    {/if}
    {#if current < total - 1}
      <div
        class="button"
        on:click={() => {
          current += 2;
        }}
        on:keypress={() => {
          current += 2;
        }}
      >
        {current + 2}
      </div>
    {/if}
    {#if current < total - 2}
      ...
      <div
        class="button"
        on:click={() => {
          current = total;
        }}
        on:keypress={() => {
          current = total;
        }}
      >
        {total}
      </div>
    {/if}
  </div>
{/if}

<style>
  .container {
    margin-top: 40px;
    text-align: center;
  }

  .button {
    background-color: var(--background-darker);
    border: 1px solid var(--border-color);
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    margin: 0 8px;
    padding: 3px 5px;
    transition: color ease 0.15s, border-color ease 0.15s,
      background-color ease 0.15s;
  }

  .button:hover,
  .active {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }
</style>
