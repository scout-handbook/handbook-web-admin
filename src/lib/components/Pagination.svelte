<script lang="ts" strictEvents>
  import PaginationButton from "$lib/components/PaginationButton.svelte";

  export let current: number;
  export let total: number;
</script>

{#if total > 1}
  <div class="container">
    {#if current > 3}
      <PaginationButton
        on:click={() => {
          current = 1;
        }}>1</PaginationButton
      >
      ...
    {/if}
    {#if current > 2}
      <PaginationButton
        on:click={() => {
          current -= 2;
        }}>{current - 2}</PaginationButton
      >
    {/if}
    {#if current > 1}
      <PaginationButton
        on:click={() => {
          current -= 1;
        }}>{current - 1}</PaginationButton
      >
    {/if}
    <PaginationButton active>{current}</PaginationButton>
    {#if current < total}
      <PaginationButton
        on:click={() => {
          current += 1;
        }}>{current + 1}</PaginationButton
      >
    {/if}
    {#if current < total - 1}
      <PaginationButton
        on:click={() => {
          current += 2;
        }}>{current + 2}</PaginationButton
      >
    {/if}
    {#if current < total - 2}
      ...
      <PaginationButton
        on:click={() => {
          current = total;
        }}>{total}</PaginationButton
      >
    {/if}
  </div>
{/if}

<style>
  .container {
    margin-top: 40px;
    text-align: center;
  }
</style>
