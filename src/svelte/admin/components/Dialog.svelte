<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";

  import Button from "./Button.svelte";
  import Overlay from "./Overlay.svelte";

  export let dismissButtonText = "";
  export let confirmButtonText: string;

  const dispatch = createEventDispatcher<{ confirm: never; dismiss: never }>();

  function keypressHandler(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      dispatch("confirm");
    }
  }
</script>

<svelte:window on:keypress={keypressHandler} />

<Overlay />
<div class="dialog">
  <div class="dialogText">
    <slot />
  </div>
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
    position: absolute;
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
