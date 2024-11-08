<script lang="ts">
  import { pushState } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";

  interface Props {
    name: string;
    ondiscard(this: void): void;
    onsave(this: void): void;
  }

  let { name = $bindable(), ondiscard, onsave }: Props = $props();
</script>

<header>
  <div class="buttons-left">
    <Button icon="cancel" yellow on:click={ondiscard}>Zrušit</Button>
    <form>
      <input autocomplete="off" type="text" bind:value={name} />
    </form>
  </div>
  <div class="buttons-right">
    <Button
      icon="cog"
      on:click={() => {
        pushState("", {
          view: "lesson-settings",
        });
      }}
    >
      Nastavení
    </Button>
    <Button green icon="floppy" on:click={onsave}>Uložit</Button>
  </div>
</header>

<style>
  .buttons-left,
  .buttons-right {
    bottom: 0;
    height: min-content;
    margin: auto 0;
    position: absolute;
    top: 0;
  }

  .buttons-left {
    left: 15px;
    width: calc(100% - 250px);
  }

  .buttons-right {
    right: 0;
  }

  form {
    display: inline-block;
    width: calc(100% - 180px);
  }

  header {
    background-color: #fff;
    border-bottom: 1px solid var(--border-color);
    height: 75px;
    position: relative;
    z-index: 8;
  }

  input {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    font-size: 1.5em;
    font-weight: bold;
    padding: 10px 16px;
    transition:
      border-color ease 0.15s,
      background-color ease 0.15s;
    width: 100%;
  }

  input:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    outline: none;
  }
</style>
