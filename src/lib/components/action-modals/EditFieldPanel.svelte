<script lang="ts">
  import type { Field } from "$lib/interfaces/Field";

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
  import { createMutation } from "@tanstack/svelte-query";

  interface Props {
    field: Field;
    fieldId: string;
  }

  let { field, fieldId }: Props = $props();

  let { description, icon, image, name } = $state(field);
  let imageSelectorOpen = $state(false);
  let iconSelectorOpen = $state(false);
  let donePromise: Promise<void> | null = $state(null);

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "field"] });
      const cachedFields = queryClient.getQueryData<Record<string, Field>>([
        "v1.0",
        "field",
        { "override-group": true },
      ]);
      if (cachedFields !== undefined) {
        const newFields = structuredClone(cachedFields);
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
  });

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
          `${$apiUri}/v1.0/field/${encodeURIComponent(fieldId)}`,
          "PUT",
          { description, icon, image, name },
        ),
      ])
        .dispatch()
        .then(() => {
          $mutation.mutate();
        });
    }
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
  <DoneDialog {donePromise}>Oblast byla úspěšně upravena.</DoneDialog>
{:else}
  <SidePanel>
    <Button
      icon="cancel"
      onclick={() => {
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
