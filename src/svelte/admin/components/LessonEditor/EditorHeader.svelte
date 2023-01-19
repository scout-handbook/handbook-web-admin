<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { useLocation, useNavigate } from "svelte-navigator";

  import Button from "../../components/Button.svelte";

  export let name: string;

  const dispatch = createEventDispatcher();
  const location = useLocation();
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
      <input
        id="name"
        class="form-text form-name"
        autocomplete="off"
        type="text"
        bind:value={name}
      />
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

  .name input {
    width: 100%;
  }
</style>
