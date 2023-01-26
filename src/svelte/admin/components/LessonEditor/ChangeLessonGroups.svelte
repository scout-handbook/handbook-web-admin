<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { groups as allGroups } from "../../../../ts/admin/stores";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";

  export let groups: Array<string>;

  const navigate = useNavigate();

  const initialGroups = groups;
  $: groupsArray = $allGroups?.entries() ?? [];
  $: publicName =
    $allGroups !== null
      ? get($allGroups.entries(), "00000000-0000-0000-0000-000000000000")
          ?.name ?? ""
      : "";

  refreshLogin();
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    groups = initialGroups;
    navigate(-1);
  }}
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  on:click={() => {
    navigate(-1);
  }}>Uložit</Button
>
<h3 class="side-panel-title">Změnit skupiny</h3>
<form id="side-panel-form">
  {#each groupsArray as [id, group]}
    <div class="form-row">
      <label class="form-switch">
        <input type="checkbox" value={id} bind:group={groups} />
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
