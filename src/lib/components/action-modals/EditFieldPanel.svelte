<script lang="ts">
  import { createMutation } from "@tanstack/svelte-query";
  import { untrack } from "svelte";

  import type { Field } from "#lib/interfaces/Field.js";

  import { Action } from "#lib/actions/Action.js";
  import { ActionQueue } from "#lib/actions/ActionQueue.js";
  import Button from "#lib/components/Button.svelte";
  import DoneDialog from "#lib/components/DoneDialog.svelte";
  import DescriptionInput from "#lib/components/forms/DescriptionInput.svelte";
  import ImageInput from "#lib/components/forms/ImageInput.svelte";
  import NameInput from "#lib/components/forms/NameInput.svelte";
  import SidePanel from "#lib/components/SidePanel.svelte";
  import SidePanelImageSelector from "#lib/components/SidePanelImageSelector.svelte";
  import { apiUri } from "#lib/config.js";
  import { deepClone } from "#lib/utils/deepClone.js";
  import { queryClient } from "#lib/utils/queryClient.js";

  interface Props {
    field: Field;
    fieldId: string;
  }

  let { field, fieldId }: Props = $props();

  let { description, icon, image, name } = $state(untrack(() => field));
  let imageSelectorOpen = $state(false);
  let iconSelectorOpen = $state(false);
  let donePromise: Promise<void> | null = $state(null);

  const mutation = createMutation(() => ({
    onMutate: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "field"] });
      const cachedFields = queryClient.getQueryData<Record<string, Field>>([
        "v1.0",
        "field",
        { "override-group": true },
      ]);
      if (cachedFields !== undefined) {
        const newFields = deepClone(cachedFields);
        newFields[fieldId].name = name;
        newFields[fieldId].description = description;
        newFields[fieldId].image = image;
        newFields[fieldId].icon = icon;
        queryClient.setQueryData<Record<string, Field>>(
          ["v1.0", "field", { "override-group": true }],
          newFields,
        );
      }
    },
  }));

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
          `${apiUri}/v1.0/field/${encodeURIComponent(fieldId)}`,
          "PUT",
          { description, icon, image, name },
        ),
      ])
        .dispatch()
        .then(() => {
          mutation.mutate();
        });
    }
  }
</script>

{#if imageSelectorOpen}
  <SidePanelImageSelector
    oncancel={(): void => {
      imageSelectorOpen = false;
    }}
    onselect={(id: string): void => {
      image = id;
      imageSelectorOpen = false;
    }}
  />
{/if}
{#if iconSelectorOpen}
  <SidePanelImageSelector
    oncancel={(): void => {
      iconSelectorOpen = false;
    }}
    onselect={(id: string): void => {
      icon = id;
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
      onclick={(): void => {
        history.back();
      }}
      yellow
    >
      Zrušit
    </Button>
    <Button green icon="floppy" onclick={saveCallback}>Uložit</Button>
    <h1>Upravit oblast</h1>
    <form>
      <NameInput bind:value={name} />
      <DescriptionInput bind:value={description} />
      <ImageInput
        name="Náhledový obrázek"
        onselect={(): void => {
          imageSelectorOpen = true;
        }}
        value={image}
      />
      <ImageInput
        name="Ikona"
        onselect={(): void => {
          iconSelectorOpen = true;
        }}
        value={icon}
      />
    </form>
  </SidePanel>
{/if}
