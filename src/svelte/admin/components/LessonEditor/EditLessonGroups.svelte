<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import { get } from "../../../../ts/admin/tools/arrayTools";
  import Button from "../Button.svelte";
  import CheckboxGroup from "../forms/CheckboxGroup.svelte";
  import GroupProvider from "../swr-wrappers/GroupProvider.svelte";

  export let groups: Array<string>;

  const navigate = useNavigate();

  const initialGroups = groups;
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
    <!-- eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return -->
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
    <!-- eslint-enable -->
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
