<script lang="ts">
  import type { Group } from "$lib/interfaces/Group";

  import Button from "$lib/components/Button.svelte";
  import CheckboxGroup from "$lib/components/forms/CheckboxGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import {
    groups as allGroups,
    sortGroups,
  } from "$lib/resources/groups.svelte";

  interface Props {
    groups: Array<string>;
  }

  let { groups = $bindable() }: Props = $props();

  const initialGroups = groups;
</script>

<Button
  icon="cancel"
  onclick={() => {
    groups = initialGroups;
    history.back();
  }}
  yellow
>
  Zrušit
</Button>
<Button
  green
  icon="floppy"
  onclick={() => {
    history.back();
  }}>Uložit</Button
>
<h1>Změnit skupiny</h1>
<form>
  {#if allGroups.current === undefined}
    <LoadingIndicator inline />
  {:else}
    <CheckboxGroup
      options={sortGroups(allGroups.current)}
      bind:selected={groups}
    >
      <!-- eslint-disable-next-line @typescript-eslint/no-shadow -- Not applicable to snippets -->
      {#snippet children(id: string, group: Group)}
        <span class:public={id === "00000000-0000-0000-0000-000000000000"}
          >{group.name}</span
        >
      {/snippet}
    </CheckboxGroup>
  {/if}
</form>
<br />
<i class="icon-info-circled"></i>
U každé lekce lze zvolit, kteří uživatelé ji budou moct zobrazit (resp. které skupiny
uživatelů). Pokud není vybrána žádná skupiny, nebude lekce pro běžné uživatele vůbec
přístupná (pouze v administraci). Pokud je vybrána skupina "
<span class="public">
  {allGroups.current?.get("00000000-0000-0000-0000-000000000000")?.name ?? ""}
</span>
", bude lekce přístupná všem uživatelům (i nepřihlášeným návštěvníkům webu) bez ohledu
na skupiny.

<style>
  .public {
    font-style: italic;
  }
</style>
