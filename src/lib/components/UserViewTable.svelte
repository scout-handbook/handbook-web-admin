<script lang="ts" strictEvents>
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import type { User } from "$lib/interfaces/User";

  import { pushState } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import { createQuery } from "@tanstack/svelte-query";

  export let users: Array<User>;

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  $: adminOrSuperuser =
    $accountQuery.data?.role === "administrator" ||
    $accountQuery.data?.role === "superuser";
</script>

<table>
  <tr>
    <th>Jméno</th>
    <th>Role</th>
    <th>Skupiny</th>
  </tr>
  {#each users as user (user.id)}
    <tr>
      <td>{user.name}</td>
      <td>
        {#if user.role === "superuser"}
          Superuser
        {:else if user.role === "administrator"}
          Administrátor
        {:else if user.role === "editor"}
          Editor
        {:else}
          Uživatel
        {/if}
        {#if adminOrSuperuser}
          <br />
          <Button
            cyan
            icon="pencil"
            on:click={() => {
              pushState("", {
                action: "change-user-role",
                actionPayload: { user },
              });
            }}
          >
            Upravit
          </Button>
          <br />
        {/if}
      </td>
      <td>
        <GroupProvider silent let:groups>
          {groups
            .filter(([id, _]) => user.groups.includes(id))
            .map(([_, group]) => group.name)
            .join(", ")}
        </GroupProvider>
        {#if user.groups.length > 0}
          <br />
        {/if}
        <Button
          cyan
          icon="pencil"
          on:click={() => {
            pushState("", {
              action: "change-user-groups",
              actionPayload: { user },
            });
          }}
        >
          Upravit
        </Button>
      </td>
    </tr>
  {/each}
</table>

<style>
  table {
    border: none;
    border-collapse: collapse;
  }

  th {
    border: none;
    border-bottom: 1px solid var(--border-color);
    padding: 8px 20px;
    text-align: left;
  }

  td {
    border: none;
    padding: 15px 20px;
  }

  td + td,
  th + th {
    padding-left: 50px;
  }
</style>
