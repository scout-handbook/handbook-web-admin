<script lang="ts" strictEvents>
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import type { Role } from "$lib/interfaces/Role";

  import Button from "$lib/components/Button.svelte";
  import Select from "$lib/components/forms/Select.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import { filter, map } from "$lib/utils/arrayUtils";
  import { createQuery } from "@tanstack/svelte-query";
  import { createEventDispatcher } from "svelte";

  export let group: string;
  export let role: "all" | Role;
  export let searchName: string;

  const dispatch = createEventDispatcher<{ change: null }>();

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  $: isSuperuser = $accountQuery.data?.role === "superuser";
  $: adminOrSuperuser =
    $accountQuery.data?.role === "administrator" ||
    $accountQuery.data?.role === "superuser";
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
      : [],
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
    on:input={() => {
      dispatch("change");
    }}
  />
  {#if adminOrSuperuser}
    <Select
      options={roleList}
      bind:selected={role}
      on:change={() => {
        dispatch("change");
      }}
    />
  {/if}
  <GroupProvider silent let:groups>
    <Select
      options={groupList.concat(
        map(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Eslint cannot handle slot props
          filter(groups, (id) => id !== "00000000-0000-0000-0000-000000000000"),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Eslint cannot handle slot props
          (item) => item.name,
        ),
      )}
      bind:selected={group}
      on:change={() => {
        dispatch("change");
      }}
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
    transition:
      border-color ease 0.15s,
      background-color ease 0.15s;
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
