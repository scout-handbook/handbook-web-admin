<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import type { Role } from "$lib/interfaces/Role";

  import Button from "$lib/components/Button.svelte";
  import Select from "$lib/components/forms/Select.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import { filter, map } from "$lib/utils/arrayUtils";
  import { createQuery } from "@tanstack/svelte-query";

  interface Props {
    group: string;
    onchange(this: void): void;
    role: "all" | Role;
    searchName: string;
  }

  let {
    group = $bindable(),
    onchange,
    role = $bindable(),
    searchName = $bindable(),
  }: Props = $props();

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let isSuperuser = $derived($accountQuery.data?.role === "superuser");
  let adminOrSuperuser = $derived(
    $accountQuery.data?.role === "administrator" ||
      $accountQuery.data?.role === "superuser",
  );
  let roleList = $derived(
    ([] as Array<[string, string]>).concat(
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
    ),
  );

  const groupList = [
    ["00000000-0000-0000-0000-000000000000", "Všechny skupiny"],
  ] as Array<[string, string]>;
</script>

<form class="search-form" onsubmit={onchange}>
  <input
    class="search-box"
    oninput={onchange}
    placeholder="Jméno uživatele"
    type="text"
    bind:value={searchName}
  />
  {#if adminOrSuperuser}
    <Select {onchange} options={roleList} bind:selected={role} />
  {/if}
  <GroupProvider silent>
    {#snippet children(groups)}
      <Select
        {onchange}
        options={groupList.concat(
          map(
            filter(
              groups,
              (id) => id !== "00000000-0000-0000-0000-000000000000",
            ),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Eslint cannot handle slot props
            (item) => item.name,
          ),
        )}
        bind:selected={group}
      />
    {/snippet}
  </GroupProvider>
  {#if searchName || role !== "all" || group !== "00000000-0000-0000-0000-000000000000"}
    <Button
      icon="cancel"
      onclick={() => {
        role = "all";
        searchName = "";
        group = "00000000-0000-0000-0000-000000000000";
        onchange();
      }}
      yellow
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
