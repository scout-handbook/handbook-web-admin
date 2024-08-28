<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Field } from "../../../../ts/admin/interfaces/Field";
  import type { SWRMutateFix } from "../../../../ts/admin/SWRMutateFix";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import DescriptionInput from "../forms/DescriptionInput.svelte";
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
  const { revalidate } = useSWR<SWRMutateFix<Record<string, Field>>>(
    constructURL("v1.0/field?override-group=true"),
  );

  function saveCallback(): void {
    donePromise = new ActionQueue([
      new Action($apiUri + "/v1.0/field", "POST", {
        name: encodeURIComponent(name),
        description: encodeURIComponent(description),
        image: encodeURIComponent(image),
        icon: encodeURIComponent(icon),
      }),
    ])
      .dispatch()
      .then(() => {
        revalidate({ force: true });
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
        navigate(-1);
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
