<script lang="ts">
  import type { Group } from "$lib/interfaces/Group";
  import type { User } from "$lib/interfaces/User";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { apiUri } from "$lib/stores";
  import { filter, get } from "$lib/utils/arrayUtils";
  import { queryClient } from "$lib/utils/queryClient";

  interface Props {
    groups: Array<[string, Group]>;
    payload: { user: User };
  }

  let { groups, payload }: Props = $props();

  let selectedGroups = $state(payload.user.groups);
  let donePromise: Promise<void> | null = $state(null);

  let publicName = $derived(
    get(groups, "00000000-0000-0000-0000-000000000000")?.name ?? "",
  );

  function saveCallback(): void {
    if (
      selectedGroups.length === payload.user.groups.length &&
      selectedGroups.every(
        (value, index) => value === payload.user.groups[index],
      )
    ) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          `${$apiUri}/v1.0/user/${encodeURIComponent(payload.user.id)}/group`,
          "PUT",
          { group: selectedGroups.map(encodeURIComponent) },
        ),
      ])
        .dispatch()
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: ["v1.0", "user"],
          });
        });
    }
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise}>
    Uživatelské skupiny byly úspěšně upraveny.
  </DoneDialog>
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
    <h1>Změnit skupiny: {payload.user.name}</h1>
    <form>
      <CheckboxGroup
        options={filter(
          groups,
          (id) => id !== "00000000-0000-0000-0000-000000000000",
        )}
        bind:selected={selectedGroups}
      >
        {#snippet children(_, group)}
          {group.name}
        {/snippet}
      </CheckboxGroup>
    </form>
    <br />
    <i class="icon-info-circled"></i>
    Každého uživatele lze zařadit do několika skupin (nebo i žádné). Podle toho poté
    tento uživatel bude moct zobrazit pouze lekce, které byly těmto skupiným zveřejněny.
    Lekce ve skupině "<span class="public">{publicName}</span>" uvidí všichni
    uživatelé bez ohledu na jejich skupiny.
  </SidePanel>
{/if}

<style>
  .public {
    font-style: italic;
  }
</style>
