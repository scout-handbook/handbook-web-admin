<script lang="ts">
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

  interface Props {
    description?: string;
    icon?: string;
    image?: string;
    name?: string;
  }

  let {
    description = $bindable("Popis nové oblasti"),
    icon = $bindable("00000000-0000-0000-0000-000000000000"),
    image = $bindable("00000000-0000-0000-0000-000000000000"),
    name = $bindable("Nová oblast"),
  }: Props = $props();

  let imageSelectorOpen = $state(false);
  let iconSelectorOpen = $state(false);
  let donePromise: Promise<void> | null = $state(null);

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
    oncancel={() => {
      imageSelectorOpen = false;
    }}
    onselect={(id) => {
      image = id;
      imageSelectorOpen = false;
    }}
  />
{/if}
{#if iconSelectorOpen}
  <SidePanelImageSelector
    oncancel={() => {
      iconSelectorOpen = false;
    }}
    onselect={(id) => {
      icon = id;
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
      onclick={() => {
        history.back();
      }}
      yellow>Zrušit</Button
    >
    <Button green icon="floppy" onclick={saveCallback}>Uložit</Button>
    <h1>Přidat oblast</h1>
    <form>
      <NameInput bind:value={name} />
      <DescriptionInput bind:value={description} />
      <ImageInput
        name="Náhledový obrázek"
        onselect={() => {
          imageSelectorOpen = true;
        }}
        value={image}
      />
      <ImageInput
        name="Ikona"
        onselect={() => {
          iconSelectorOpen = true;
        }}
        value={icon}
      />
    </form>
  </SidePanel>
{/if}
