<script lang="ts" strictEvents>
  import Button from "$lib/components/Button.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import { get } from "$lib/utils/arrayUtils";

  export let groups: Array<string>;

  const initialGroups = groups;
</script>

<Button
  icon="cancel"
  yellow
  on:click={() => {
    groups = initialGroups;
    history.back();
  }}
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  on:click={() => {
    history.back();
  }}>Uložit</Button
>
<h1>Změnit skupiny</h1>
<form>
  <GroupProvider inline let:groups={allGroups}>
    <CheckboxGroup
      options={allGroups}
      bind:selected={groups}
      let:id
      let:value={group}
    >
      <span class:public={id === "00000000-0000-0000-0000-000000000000"}
        >{group.name}</span
      >
    </CheckboxGroup>
  </GroupProvider>
</form>
<br />
<i class="icon-info-circled" />
U každé lekce lze zvolit, kteří uživatelé ji budou moct zobrazit (resp. které skupiny
uživatelů). Pokud není vybrána žádná skupiny, nebude lekce pro běžné uživatele vůbec
přístupná (pouze v administraci). Pokud je vybrána skupina "
<span class="public">
  <GroupProvider silent let:groups={allGroups}>
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
