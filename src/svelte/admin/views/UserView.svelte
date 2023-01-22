<script lang="ts">
  import { useSWR } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { IDList } from "../../../ts/admin/IDList";
  import type { Group } from "../../../ts/admin/interfaces/Group";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import type { Role } from "../../../ts/admin/interfaces/Role";
  import type { User } from "../../../ts/admin/interfaces/User";
  import type { UserListResponse } from "../../../ts/admin/interfaces/UserListResponse";
  import { siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import ChangeUserGroupsPanel from "../components/action-modals/ChangeUserGroupsPanel.svelte";
  import ChangeUserRolePanel from "../components/action-modals/ChangeUserRolePanel.svelte";
  import Button from "../components/Button.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Pagination from "../components/Pagination.svelte";

  export let groups: IDList<Group>;
  export let loginstate: Loginstate;

  const location = useLocation<{
    action: string;
    actionPayload: { user: User };
  }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

  let page = 1;
  const perPage = 25;
  let role: Role | "all" = "all";
  let searchName = "";
  let group = "00000000-0000-0000-0000-000000000000";

  $: payload = {
    name: searchName,
    page: page,
    "per-page": perPage,
    role: role !== "all" ? role : undefined,
    group: group !== "00000000-0000-0000-0000-000000000000" ? group : undefined,
  };
  $: ({ data: userList } = useSWR<UserListResponse>(() =>
    constructURL("v1.0/user", payload)
  ));
  $: userListCount = $userList?.count;
  let users: Array<User> | undefined;
  $: users = $userList?.users;

  refreshLogin(true);

  function groupsList(user: User): string {
    let first = true;
    let output = "";
    groups
      .filter(function (id) {
        return user.groups.includes(id);
      })
      .iterate(function (_, group) {
        if (!first) {
          output += ", ";
        }
        output += group.name;
        first = false;
      });
    return output;
  }
</script>

{#if action === "change-user-groups"}
  <ChangeUserGroupsPanel {groups} payload={actionPayload} />
{:else if action === "change-user-role"}
  <ChangeUserRolePanel {loginstate} payload={actionPayload} />
{/if}

<h1>{$siteName + " - Uživatelé"}</h1>
<div id="userList">
  <form
    id="user-search-form"
    on:input={() => {
      page = 1;
    }}
  >
    <input
      id="user-search-box"
      class="form-text"
      placeholder="Jméno uživatele"
      type="text"
      bind:value={searchName}
    />
    {#if loginstate.role === "administrator" || loginstate.role === "superuser"}
      <select id="role-search-filter" class="form-select" bind:value={role}>
        <option id="all" class="select-filter-special" value="all">
          Všechny role
        </option>
        <option id="user" value="user">Uživatel</option>
        <option id="editor" value="editor">Editor</option>
        {#if loginstate.role === "superuser"}
          <option id="administrator" value="administrator">
            Administrátor
          </option>
          <option id="superuser" value="superuser">Superuser</option>
        {/if}
      </select>
    {/if}
    <select id="group-search-filter" class="form-select" bind:value={group}>
      <option
        id="00000000-0000-0000-0000-000000000000"
        class="select-filter-special"
        value="00000000-0000-0000-0000-000000000000"
      >
        Všechny skupiny
      </option>
      {#each groups
        .filter(function (id) {
          return id !== "00000000-0000-0000-0000-000000000000";
        })
        .asArray() as { id, value: group }}
        <option {id} value={id}>{group.name}</option>
      {/each}
    </select>
    {#if searchName || role !== "all" || group !== "00000000-0000-0000-0000-000000000000"}
      <Button
        icon="cancel"
        yellow
        on:click={() => {
          page = 1;
          role = "all";
          searchName = "";
          group = "00000000-0000-0000-0000-000000000000";
        }}
      >
        Zrušit
      </Button>
    {/if}
  </form>
  {#if users === undefined || userListCount === undefined}
    <LoadingIndicator />
  {:else}
    <table class="user-table">
      <tr>
        <th>Jméno</th>
        <th>Role</th>
        <th>Skupiny</th>
      </tr>
      {#each users as user}
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
            {#if loginstate.role === "administrator" || loginstate.role === "superuser"}
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
            {groupsList(user)}
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
    <Pagination
      total={Math.ceil(userListCount / perPage)}
      bind:current={page}
    />
  {/if}
</div>
