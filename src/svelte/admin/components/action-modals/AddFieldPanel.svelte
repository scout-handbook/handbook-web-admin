<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import ImageInput from "../forms/ImageInput.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import SidePanel from "../SidePanel.svelte";
  import SidePanelImageSelector from "../SidePanelImageSelector.svelte";

  export let name = "Nová oblast";
  export let description = "Popis nové oblasti";
  export let image = "00000000-0000-0000-0000-000000000000";
  export let icon = "00000000-0000-0000-0000-000000000000";

  const navigate = useNavigate();

  let imageSelectorOpen = false;
  let iconSelectorOpen = false;
  let donePromise: Promise<void> | null = null;

  refreshLogin();

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action($apiUri + "/v1.0/field", "POST", {
        name: encodeURIComponent(name),
        description: encodeURIComponent(description),
        image: encodeURIComponent(image),
        icon: encodeURIComponent(icon),
      }),
    ]).dispatch();
  }
</script>

{#if imageSelectorOpen}
  <SidePanelImageSelector
    on:cancel={() => {
      imageSelectorOpen = false;
    }}
    on:select={(event) => {
      image = event.detail;
      imageSelectorOpen = false;
    }}
  />
{/if}
{#if iconSelectorOpen}
  <SidePanelImageSelector
    on:cancel={() => {
      iconSelectorOpen = false;
    }}
    on:select={(event) => {
      icon = event.detail;
      iconSelectorOpen = false;
    }}
  />
{/if}
{#if donePromise !== null}
  <DoneDialog {donePromise} />
{:else}
  <SidePanel>
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        navigate(-1);
      }}>Zrušit</Button
    >
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
    <h1>Přidat oblast</h1>
    <form>
      <NameInput bind:value={name} />
      <textarea
        class="form-text description"
        autocomplete="off"
        rows="5"
        bind:value={description}
      />
      <ImageInput
        name="Náhledový obrázek"
        bind:value={image}
        on:select={() => {
          imageSelectorOpen = true;
        }}
      />
      <ImageInput
        name="Ikona"
        bind:value={icon}
        on:select={() => {
          iconSelectorOpen = true;
        }}
      />
    </form>
  </SidePanel>
{/if}

<style>
  .description {
    margin-top: 20px;
  }
</style>
