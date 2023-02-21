<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import Button from "../Button.svelte";
  import GroupProvider from "../swr-wrappers/GroupProvider.svelte";

  export let groups: Array<string>;

  const navigate = useNavigate();

  const initialGroups = groups;

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
<h1>Změnit skupiny</h1>
<form>
  <GroupProvider inline let:groups={allGroups}>
    {#each allGroups as [id, group]}
      <div class="form-row">
        <label class="form-switch">
          <input type="checkbox" value={id} bind:group={groups} />
          <span class="form-custom form-checkbox" />
        </label>
        {#if id === "00000000-0000-0000-0000-000000000000"}
          <span class="public">{group.name}</span>
        {:else}
          {group.name}
        {/if}
      </div>
    {/each}
  </GroupProvider>
</form>
<br />
<i class="icon-info-circled" />
U každé lekce lze zvolit, kteří uživatelé ji budou moct zobrazit (resp. které skupiny
uživatelů). Pokud není vybrána žádná skupiny, nebude lekce pro běžné uživatele vůbec
přístupná (pouze v administraci). Pokud je vybrána skupina "
<span class="public">
  <GroupProvider silent let:groups={allGroups}>
    <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
    {get(allGroups, "00000000-0000-0000-0000-000000000000")?.name ?? ""}
  </GroupProvider>
</span>
", bude lekce přístupná všem uživatelům (i nepřihlášeným návštěvníkům webu) bez ohledu
na skupiny.

<style>
  .public {
    font-style: italic;
  }
</style>
