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
    class="search-box"
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
    border: 1px solid var(--border-color);
    border-radius: 3px;
    font-family: "Open Sans", sans-serif;
    margin-right: 10px;
    padding: 5px 10px;
    transition: border-color ease 0.15s, background-color ease 0.15s;
    width: 151px;
  }

  .search-box:focus {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    outline: none;
  }

  .search-form {
    margin-bottom: 30px;
  }
</style>
