<script lang="ts">
  import type { Group } from "$lib/interfaces/Group";
  import type { User } from "$lib/interfaces/User";

  import { Action } from "$lib/actions/Action";
  import { ActionQueue } from "$lib/actions/ActionQueue";
  import Button from "$lib/components/Button.svelte";
  import DoneDialog from "$lib/components/DoneDialog.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { groups, sortGroups } from "$lib/resources/groups.svelte";
  import { filter } from "$lib/utils/mapUtils";
  import { queryClient } from "$lib/utils/queryClient";

  interface Props {
    user: User;
  }

  let { user }: Props = $props();

  let selectedGroups = $state(user.groups);
  let donePromise: Promise<void> | null = $state(null);

  let publicName = $derived(
    groups.current?.get("00000000-0000-0000-0000-000000000000")?.name ?? "",
  );

  function saveCallback(): void {
    if (
      selectedGroups.length === user.groups.length &&
      selectedGroups.every((value, index) => value === user.groups[index])
    ) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          `${CONFIG["api-uri"]}/v1.0/user/${encodeURIComponent(user.id)}/group`,
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
      onclick={(): void => {
        history.back();
      }}
      yellow
    >
      Zrušit
    </Button>
    <Button green icon="floppy" onclick={saveCallback}>Uložit</Button>
    <h1>Změnit skupiny: {user.name}</h1>
    {#if groups.current === undefined}
      <LoadingIndicator inline />
    {:else}
      <form>
        <CheckboxGroup
          options={sortGroups(
            filter(
              groups.current,
              (id) => id !== "00000000-0000-0000-0000-000000000000",
            ),
          )}
          bind:selected={selectedGroups}
        >
          {#snippet children(_, group: Group)}
            {group.name}
          {/snippet}
        </CheckboxGroup>
      </form>
    {/if}
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
