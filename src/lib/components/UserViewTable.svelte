<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";
  import type { User } from "$lib/interfaces/User";

  import { pushState } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import { groups, sortGroups } from "$lib/resources/groups.svelte";
  import { filter } from "$lib/utils/mapUtils";
  import { createQuery } from "@tanstack/svelte-query";

  interface Props {
    users: Array<User>;
  }

  let { users }: Props = $props();

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let adminOrSuperuser = $derived(
    $accountQuery.data?.role === "administrator" ||
      $accountQuery.data?.role === "superuser",
  );
</script>

<table>
  <thead>
    <tr>
      <th>Jméno</th>
      <th>Role</th>
      <th>Skupiny</th>
    </tr>
  </thead>
  <tbody>
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
              onclick={() => {
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
          {#if groups.current !== undefined}
            {[
              ...sortGroups(
                filter(groups.current, (id) => user.groups.includes(id)),
              ),
            ]
              .map(([_, group]) => group.name)
              .join(", ")}
          {/if}
          {#if user.groups.length > 0}
            <br />
          {/if}
          <Button
            cyan
            icon="pencil"
            onclick={() => {
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
  </tbody>
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
