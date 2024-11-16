<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import type { Role } from "$lib/interfaces/Role";

  import Button from "$lib/components/Button.svelte";
  import Select from "$lib/components/forms/Select.svelte";
  import { groups, sortGroups } from "$lib/resources/groups";
  import { filter, map } from "$lib/utils/mapUtils";
  import { createQuery } from "@tanstack/svelte-query";
  import { SvelteMap } from "svelte/reactivity";

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
    new SvelteMap([
      ["all", "Všechny role"],
      ["user", "Uživatel"],
      ["editor", "Editor"],
      ...(isSuperuser
        ? ([
            ["administrator", "Administrátor"],
            ["superuser", "Superuser"],
          ] as const)
        : ([] as Array<[string, string]>)),
    ]),
  );

  const groupList = $derived(
    $groups !== undefined
      ? new SvelteMap([
          ["00000000-0000-0000-0000-000000000000", "Všechny skupiny"],
          ...map(
            sortGroups(
              filter(
                $groups,
                (groupId) => groupId !== "00000000-0000-0000-0000-000000000000",
              ),
            ),
            (id, groupValue) => [id, groupValue.name],
          ),
        ])
      : undefined,
  );
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
  {#if groupList !== undefined}
    <Select {onchange} options={groupList} bind:selected={group} />
  {/if}
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
