<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Field } from "../../../../ts/admin/interfaces/Field";

  import { Action } from "../../../../ts/admin/actions/Action";
  import { ActionQueue } from "../../../../ts/admin/actions/ActionQueue";
  import { apiUri } from "../../../../ts/admin/stores";
  import {
    type SWRMutateFix,
    SWRMutateFnWrapper,
  } from "../../../../ts/admin/SWRMutateFix";
  import { get } from "../../../../ts/admin/utils/arrayUtils";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import DescriptionInput from "../forms/DescriptionInput.svelte";
  import ImageInput from "../forms/ImageInput.svelte";
  import NameInput from "../forms/NameInput.svelte";
  import SidePanel from "../SidePanel.svelte";
  import SidePanelImageSelector from "../SidePanelImageSelector.svelte";

  export let fields: Array<[string, Field]>;
  export let payload: { fieldId: string };

  const navigate = useNavigate();

  const field = get(fields, payload.fieldId)!;
  let { name, description, image, icon } = field;
  let imageSelectorOpen = false;
  let iconSelectorOpen = false;
  let donePromise: Promise<void> | null = null;
  const { mutate } = useSWR<SWRMutateFix<Record<string, Field>>>(
    constructURL("v1.0/field?override-group=true"),
  );

  function saveCallback(): void {
    if (
      field.name === name &&
      field.description === description &&
      field.image === image &&
      field.icon === icon
    ) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          $apiUri + "/v1.0/field/" + encodeURIComponent(payload.fieldId),
          "PUT",
          { name, description, image, icon },
        ),
      ])
        .dispatch()
        .then(() => {
          mutate(
            SWRMutateFnWrapper((cachedFields) => {
              cachedFields[payload.fieldId].name = name;
              cachedFields[payload.fieldId].description = description;
              cachedFields[payload.fieldId].image = image;
              cachedFields[payload.fieldId].icon = icon;
              return cachedFields;
            }),
          );
        });
    }
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
  <DoneDialog {donePromise}>Oblast byla úspěšně upravena.</DoneDialog>
{:else}
  <SidePanel>
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        navigate(-1);
      }}
    >
      Zrušit
    </Button>
    <Button green icon="floppy" on:click={saveCallback}>Uložit</Button>
    <h1>Upravit oblast</h1>
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
