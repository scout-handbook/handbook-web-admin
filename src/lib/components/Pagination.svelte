<script lang="ts">
  import PaginationButton from "$lib/components/PaginationButton.svelte";

  interface Props {
    current: number;
    total: number;
  }

  let { current = $bindable(), total }: Props = $props();
</script>

{#if total > 1}
  <div class="container">
    {#if current > 3}
      <PaginationButton
        onclick={() => {
          current = 1;
        }}>1</PaginationButton
      >
      ...
    {/if}
    {#if current > 2}
      <PaginationButton
        onclick={() => {
          current -= 2;
        }}>{current - 2}</PaginationButton
      >
    {/if}
    {#if current > 1}
      <PaginationButton
        onclick={() => {
          current -= 1;
        }}>{current - 1}</PaginationButton
      >
    {/if}
    <PaginationButton active>{current}</PaginationButton>
    {#if current < total}
      <PaginationButton
        onclick={() => {
          current += 1;
        }}>{current + 1}</PaginationButton
      >
    {/if}
    {#if current < total - 1}
      <PaginationButton
        onclick={() => {
          current += 2;
        }}>{current + 2}</PaginationButton
      >
    {/if}
    {#if current < total - 2}
      ...
      <PaginationButton
        onclick={() => {
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
