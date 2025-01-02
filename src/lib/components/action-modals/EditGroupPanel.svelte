<script lang="ts">
  import type { Group } from "$lib/interfaces/Group";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import NameInput from "$lib/components/forms/NameInput.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { queryClient } from "$lib/utils/queryClient";
  import { createMutation } from "@tanstack/svelte-query";

  interface Props {
    group: Group;
    groupId: string;
  }

  let { group, groupId }: Props = $props();

  let { name } = $state(group);
  let donePromise: Promise<void> | null = $state(null);

  const mutation = createMutation({
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["v1.0", "group"] });
      const cachedGroups = queryClient.getQueryData<Record<string, Group>>([
        "v1.0",
        "group",
      ]);
      if (cachedGroups !== undefined) {
        const newGroups = structuredClone(cachedGroups);
        newGroups[groupId].name = name;
        queryClient.setQueryData<Record<string, Group>>(
          ["v1.0", "group"],
          newGroups,
        );
      }
    },
  });

  function saveCallback(): void {
    if (group.name === name) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          `${CONFIG["api-uri"]}/v1.0/group/${encodeURIComponent(groupId)}`,
          "PUT",
          { name },
        ),
      ])
        .dispatch()
        .then(() => {
          $mutation.mutate();
        });
    }
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>Skupina byla úspěšně upravena.</DoneDialog>
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
    <h1>Upravit skupinu</h1>
    <form>
      <NameInput bind:value={name} />
    </form>
  </SidePanel>
{/if}
