<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { createEventDispatcher } from "svelte";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import type { Role } from "../../../ts/admin/interfaces/Role";
  import { filter, map } from "../../../ts/admin/tools/arrayTools";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import Button from "../components/Button.svelte";
  import GroupProvider from "../components/swr-wrappers/GroupProvider.svelte";
  import Select from "./forms/Select.svelte";

  export let group: string;
  export let role: Role | "all";
  export let searchName: string;

  const dispatch = createEventDispatcher<{ change: never }>();

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: isSuperuser = $loginstate?.role === "superuser";
  $: adminOrSuperuser = $loginstate?.role === "administrator" || isSuperuser;
  $: roleList = ([] as Array<[string, string]>).concat(
    [
      ["all", "Všechny role"],
      ["user", "Uživatel"],
      ["editor", "Editor"],
    ],
    isSuperuser
      ? [
          ["administrator", "Administrátor"],
          ["superuser", "Superuser"],
        ]
      : []
  );

  const groupList = [
    ["00000000-0000-0000-0000-000000000000", "Všechny skupiny"],
  ] as Array<[string, string]>;
</script>

<form
  class="search-form"
  on:submit={() => {
    dispatch("change");
  }}
>
  <input
    class="form-text search-box"
    placeholder="Jméno uživatele"
    type="text"
    bind:value={searchName}
  />
  {#if adminOrSuperuser}
    <Select options={roleList} bind:selected={role} />
  {/if}
  <GroupProvider silent let:groups>
    <Select
      options={groupList.concat(
        map(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          filter(groups, (id) => id !== "00000000-0000-0000-0000-000000000000"),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          (group) => group.name
        )
      )}
      bind:selected={group}
    />
  </GroupProvider>
  <Button
    icon="search"
    on:click={() => {
      dispatch("change");
    }}
  >
    Vyhledat
  </Button>
  {#if searchName || role !== "all" || group !== "00000000-0000-0000-0000-000000000000"}
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        role = "all";
        searchName = "";
        group = "00000000-0000-0000-0000-000000000000";
        dispatch("change");
      }}
    >
      Zrušit
    </Button>
  {/if}
</form>

<style>
  .search-box {
    margin-right: 10px;
    width: 151px;
  }

  .search-form {
    margin-bottom: 30px;
  }
</style>
