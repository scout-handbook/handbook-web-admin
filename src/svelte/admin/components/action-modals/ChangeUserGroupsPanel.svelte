<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import type { User } from "../../../../ts/admin/interfaces/User";
  import { apiUri } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { filter, get } from "../../../../ts/admin/tools/arrayTools";
  import Button from "../Button.svelte";
  import DoneDialog from "../DoneDialog.svelte";
  import CheckboxGroup from "../forms/CheckboxGroup.svelte";
  import SidePanel from "../SidePanel.svelte";

  export let groups: Array<[string, Group]>;
  export let payload: { user: User };
  export let revalidate: (() => void) | undefined = undefined;

  const navigate = useNavigate();

  let selectedGroups = payload.user.groups;
  let donePromise: Promise<void> | null = null;

  $: publicName =
    get(groups, "00000000-0000-0000-0000-000000000000")?.name ?? "";

  function saveCallback(): void {
    if (
      selectedGroups.length === payload.user.groups.length &&
      selectedGroups.every(
        (value, index) => value === payload.user.groups[index]
      )
    ) {
      donePromise = new Promise((resolve) => {
        resolve();
      });
    } else {
      donePromise = new ActionQueue([
        new Action(
          $apiUri +
            "/v1.0/user/" +
            encodeURIComponent(payload.user.id) +
            "/group",
          "PUT",
          { group: selectedGroups.map(encodeURIComponent) }
        ),
      ]).dispatch();
      revalidate?.();
    }
  }
</script>

{#if donePromise !== null}
  <DoneDialog {donePromise} />
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
    <h1>Změnit skupiny: {payload.user.name}</h1>
    <form>
      <CheckboxGroup
        options={filter(
          groups,
          (id) => id !== "00000000-0000-0000-0000-000000000000"
        )}
        bind:selected={selectedGroups}
        let:value={group}
      >
        {group.name}
      </CheckboxGroup>
    </form>
    <br />
    <i class="icon-info-circled" />
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
