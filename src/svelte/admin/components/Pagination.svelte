<script lang="ts">
  export let current: number;
  export let total: number;
</script>

{#if total > 1}
  <div id="pagination">
    {#if current > 3}
      <div class="pagination-button" data-page="1">1</div>
      ...
    {/if}
    {#if current > 2}
      <div class="pagination-button" data-page={current - 2}>
        {current - 2}
      </div>
    {/if}
    {#if current > 1}
      <div class="pagination-button" data-page={current - 1}>
        {current - 1}
      </div>
    {/if}
    <div class="pagination-button active-pagination-button">
      {current}
    </div>
    {#if current < total}
      <div class="pagination-button" data-page={current + 1}>
        {current + 1}
      </div>
    {/if}
    {#if current < total - 1}
      <div class="pagination-button" data-page={current + 2}>
        {current + 2}
      </div>
    {/if}
    {#if current < total - 2}
      ...
      <div class="pagination-button" data-page={total}>
        {total}
      </div>
    {/if}
  </div>
{/if}
