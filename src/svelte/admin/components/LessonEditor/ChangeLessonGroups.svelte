<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";
  import { useNavigate } from "svelte-navigator";

  import type { Group } from "../../../../ts/admin/interfaces/Group";
  import { processGroups } from "../../../../ts/admin/swr";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let groups: Array<string>;

  const navigate = useNavigate();

  const allGroups = derived(
    useSWR<Record<string, Group>>(constructURL("v1.0/group")).data,
    processGroups,
    undefined
  );
  const initialGroups = groups;
  $: publicName =
    $allGroups !== undefined
      ? get($allGroups, "00000000-0000-0000-0000-000000000000")?.name ?? ""
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
  {#if $allGroups === undefined}
    <LoadingIndicator />
  {:else}
    {#each $allGroups as [id, group]}
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
  {/if}
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
