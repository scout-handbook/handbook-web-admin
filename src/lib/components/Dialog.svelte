<script lang="ts" strictEvents>
  import Button from "$lib/components/Button.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import { createEventDispatcher } from "svelte";

  interface $$Slots {
    default: Record<string, never>;
  }

  export let dismissButtonText = "";
  export let confirmButtonText: string;

  const dispatch = createEventDispatcher<{ confirm: null; dismiss: null }>();

  function keypressHandler(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      dispatch("confirm");
    }
  }
</script>

<svelte:window on:keypress={keypressHandler} />

<Overlay />
<div class="dialog">
  <slot />
  <div class="buttons">
    {#if dismissButtonText !== ""}
      <Button
        icon="cancel"
        yellow
        on:click={() => {
          dispatch("dismiss");
        }}
      >
        {dismissButtonText}
      </Button>
    {/if}
    <Button
      icon="ok"
      on:click={() => {
        dispatch("confirm");
      }}
    >
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
