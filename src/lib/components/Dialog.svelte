<script lang="ts">
  import type { Snippet } from "svelte";

  import Button from "$lib/components/Button.svelte";
  import Overlay from "$lib/components/Overlay.svelte";

  interface Props {
    children: Snippet;
    confirmButtonText: string;
    dismissButtonText?: string;
    onconfirm(this: void): void;
    ondismiss?(this: void): void;
  }

  let {
    children,
    confirmButtonText,
    dismissButtonText = "",
    onconfirm,
    ondismiss,
  }: Props = $props();

  function keypressHandler(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      onconfirm();
    }
  }
</script>

<svelte:window onkeypress={keypressHandler} />

<Overlay />
<div class="dialog">
  {@render children()}
  <div class="buttons">
    {#if dismissButtonText !== ""}
      <Button
        icon="cancel"
        onclick={() => {
          ondismiss?.();
        }}
        yellow
      >
        {dismissButtonText}
      </Button>
    {/if}
    <Button icon="ok" onclick={onconfirm}>
      {confirmButtonText}
    </Button>
  </div>
</div>

<style>
  .dialog {
    background-color: #fff;
    border-radius: 5px;
    height: 150px;
    left: 50%;
    padding: 40px;
    position: fixed;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    z-index: 9;
  }

  .buttons {
    bottom: 25px;
    position: absolute;
    right: 10px;
  }
</style>
