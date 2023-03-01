<script lang="ts" strictEvents>
  import { createEventDispatcher } from "svelte";
  import { useLocation, useNavigate } from "svelte-navigator";

  import Button from "../../components/Button.svelte";

  export let name: string;

  const dispatch = createEventDispatcher<{ discard: never; save: never }>();
  const location = useLocation<Record<string, never>>();
  const navigate = useNavigate();
  $: currentUri = $location.pathname + $location.search;
</script>

<header>
  <div class="buttons-left">
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        dispatch("discard");
      }}>Zrušit</Button
    >
    <form class="name">
      <input autocomplete="off" type="text" bind:value={name} />
    </form>
  </div>
  <div class="buttons-right">
    <Button
      icon="cog"
      on:click={() => {
        navigate(currentUri, {
          state: { view: "lesson-settings" },
        });
      }}
    >
      Nastavení
    </Button>
    <Button
      green
      icon="floppy"
      on:click={() => {
        dispatch("save");
      }}>Uložit</Button
    >
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

  .name {
    display: inline-block;
    width: calc(100% - 180px);
  }

  input {
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    font-size: 1.5em;
    font-weight: bold;
    padding: 10px 16px;
    transition: border-color ease 0.15s, background-color ease 0.15s;
    width: 100%;
  }

  input:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    outline: none;
  }
</style>
