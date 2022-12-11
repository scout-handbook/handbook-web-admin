<script lang="ts">
  import { customProperties } from "../../../ts/admin/stores";

  import Button from "./Button.svelte";

  export let body: string;
  export let dismissButtonText: string;
  export let confirmButtonText: string;
  export let dismissCallback: () => void;
  export let confirmCallback: () => void;

  $: ({ "--overlay-color": overlayColor } = $customProperties);

  function keypressHandler(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      confirmCallback();
    }
  }
</script>

<svelte:window on:keypress={keypressHandler} />

<div style:background-color={overlayColor} class="overlay" />
<div class="dialog">
  <div class="dialogText">
    {body}
  </div>
  <div class="buttons">
    <Button icon="cancel" yellow on:click={dismissCallback}>
      {dismissButtonText}
    </Button>
    <Button icon="ok" on:click={confirmCallback}>
      {confirmButtonText}
    </Button>
  </div>
</div>

<style>
  .overlay {
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }

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
