<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { Payload } from "../../../../ts/admin/interfaces/Payload";
  import {
    lessonSettingsCache,
    setChanged,
  } from "../../../../ts/admin/lessonEditor/editor";
  import { apiUri, groups } from "../../../../ts/admin/stores";
  import { Action } from "../../../../ts/admin/tools/Action";
  import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";

  export let lessonId: string | null;
  export let saveActionQueue: ActionQueue;

  const navigate = useNavigate();

  let selectedGroups = lessonSettingsCache.groups;
  $: groupsArray = $groups?.asArray() ?? [];
  $: publicName =
    $groups?.get("00000000-0000-0000-0000-000000000000")?.name ?? "";

  refreshLogin();

  function saveCallback() {
    if (selectedGroups !== lessonSettingsCache.groups) {
      setChanged();
      saveActionQueue.actions.push(
        new Action(
          $apiUri + "/v1.0/lesson/" + (lessonId ?? "{id}") + "/group",
          "PUT",
          (): Payload => ({ group: selectedGroups.map(encodeURIComponent) })
        )
      );
      lessonSettingsCache.groups = selectedGroups;
    }
    navigate(-1);
  }
</script>

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
<h3 class="side-panel-title">Změnit skupiny</h3>
<form id="side-panel-form">
  {#each groupsArray as { id, value: group }}
    <div class="form-row">
      <label class="form-switch">
        <input type="checkbox" value={id} bind:group={selectedGroups} />
        <span class="form-custom form-checkbox" />
      </label>
      {#if id === "00000000-0000-0000-0000-000000000000"}
        <span class="public-group">{group.name}</span>
      {:else}
        {group.name}
      {/if}
    </div>
  {/each}
</form>
<div class="group-help">
  <i class="icon-info-circled" />
  U každé lekce lze zvolit, kteří uživatelé ji budou moct zobrazit (resp. které skupiny
  uživatelů). Pokud není vybrána žádná skupiny, nebude lekce pro běžné uživatele
  vůbec přístupná (pouze v administraci). Pokud je vybrána skupina "
  <span class="public-group">
    {publicName}
  </span>
  ", bude lekce přístupná všem uživatelům (i nepřihlášeným návštěvníkům webu) bez
  ohledu na skupiny.
</div>
