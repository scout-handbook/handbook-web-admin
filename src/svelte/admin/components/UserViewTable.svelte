<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import type { User } from "../../../ts/admin/interfaces/User";

  import { constructURL } from "../../../ts/admin/utils/constructURL";
  import Button from "../components/Button.svelte";
  import GroupProvider from "../components/swr-wrappers/GroupProvider.svelte";

  export let users: Array<User>;

  const navigate = useNavigate();

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: isSuperuser = $loginstate?.role === "superuser";
  $: adminOrSuperuser = $loginstate?.role === "administrator" || isSuperuser;
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
              navigate("/users", {
                state: {
                  action: "change-user-role",
                  actionPayload: { user },
                },
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
          <!-- eslint-disable @typescript-eslint/no-unsafe-return -->
          {groups
            .filter(([id, _]) => user.groups.includes(id))
            .map(([_, group]) => group.name)
            .join(", ")}
          <!-- eslint-enable -->
        </GroupProvider>
        {#if user.groups.length > 0}
          <br />
        {/if}
        <Button
          cyan
          icon="pencil"
          on:click={() => {
            navigate("/users", {
              state: {
                action: "change-user-groups",
                actionPayload: { user },
              },
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
