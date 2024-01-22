<script lang="ts" strictEvents>
  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import DescriptionInput from "$lib/components/forms/DescriptionInput.svelte";
  import ImageInput from "$lib/components/forms/ImageInput.svelte";
  import NameInput from "$lib/components/forms/NameInput.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import SidePanelImageSelector from "$lib/components/SidePanelImageSelector.svelte";
  import { apiUri } from "$lib/stores";
  import { queryClient } from "$lib/utils/queryClient";

  export let name = "Nová oblast";
  export let description = "Popis nové oblasti";
  export let image = "00000000-0000-0000-0000-000000000000";
  export let icon = "00000000-0000-0000-0000-000000000000";

  let imageSelectorOpen = false;
  let iconSelectorOpen = false;
  let donePromise: Promise<void> | null = null;

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action(`${$apiUri}/v1.0/field`, "POST", {
        description: encodeURIComponent(description),
        icon: encodeURIComponent(icon),
        image: encodeURIComponent(image),
        name: encodeURIComponent(name),
      }),
    ])
      .dispatch()
      .then(() => {
        void queryClient.invalidateQueries({
          queryKey: ["v1.0", "field"],
        });
      });
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
  <DoneDialog {donePromise}>Oblast byla úspěšně přidána.</DoneDialog>
{:else}
  <SidePanel>
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        history.back();
      }}>Zrušit</Button
    >
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
    <h1>Přidat oblast</h1>
    <form>
      <NameInput bind:value={name} />
      <DescriptionInput bind:value={description} />
      <ImageInput
        name="Náhledový obrázek"
        value={image}
        on:select={() => {
          imageSelectorOpen = true;
        }}
      />
      <ImageInput
        name="Ikona"
        value={icon}
        on:select={() => {
          iconSelectorOpen = true;
        }}
      />
    </form>
  </SidePanel>
{/if}
