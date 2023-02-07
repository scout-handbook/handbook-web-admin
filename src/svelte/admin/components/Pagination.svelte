<script lang="ts" strictEvents>
  export let current: number;
  export let total: number;
</script>

{#if total > 1}
  <div id="pagination">
    {#if current > 3}
      <div
        class="pagination-button"
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
        class="pagination-button"
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
        class="pagination-button"
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
    <div class="pagination-button active-pagination-button">
      {current}
    </div>
    {#if current < total}
      <div
        class="pagination-button"
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
        class="pagination-button"
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
        class="pagination-button"
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
