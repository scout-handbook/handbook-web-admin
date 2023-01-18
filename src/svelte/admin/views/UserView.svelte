<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import { IDList } from "../../../ts/admin/IDList";
  import { Group } from "../../../ts/admin/interfaces/Group";
  import { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { Payload } from "../../../ts/admin/interfaces/Payload";
  import { RequestResponse } from "../../../ts/admin/interfaces/RequestResponse";
  import { Role } from "../../../ts/admin/interfaces/Role";
  import { User } from "../../../ts/admin/interfaces/User";
  import { UserListResponse } from "../../../ts/admin/interfaces/UserListResponse";
  import { UserSearchQuery } from "../../../ts/admin/interfaces/UserSearchQuery";
  import { apiUri, siteName } from "../../../ts/admin/stores";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import ChangeUserGroupsPanel from "../components/action-modals/ChangeUserGroupsPanel.svelte";
  import ChangeUserRolePanel from "../components/action-modals/ChangeUserRolePanel.svelte";
  import Button from "../components/Button.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Pagination from "../components/Pagination.svelte";

  export let groups: IDList<Group>;
  export let loginstate: Loginstate;

  const location = useLocation();
  const navigate = useNavigate();
  $: action = $location.state?.action as string | null;
  $: actionPayload = $location.state?.actionPayload as { user: User };

  let page = 1;
  const perPage = 25;
  let role: Role | "all" = "all";
  let searchName = "";
  let group = "00000000-0000-0000-0000-000000000000";

  let userListPromise: Promise<UserListResponse>;

  $: userListPromise = new Promise((resolve) => {
    const payload: UserSearchQuery = {
      name: searchName,
      page: page,
      "per-page": perPage,
    };
    if (role !== "all") {
      payload.role = role;
    }
    if (group !== "00000000-0000-0000-0000-000000000000") {
      payload.group = group;
    }
    request(
      $apiUri + "/v1.0/user",
      "GET",
      payload as unknown as Payload,
      function (response: RequestResponse): void {
        resolve(response as UserListResponse);
      },
      reAuthHandler
    );
  });

  refreshLogin(true);

  function groupsList(user: User) {
    let first = true;
    let output = "";
    groups
      .filter(function (id) {
        return user.groups.indexOf(id) >= 0;
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
  {#await userListPromise}
    <LoadingIndicator />
  {:then userList}
    <form
      id="user-search-form"
      on:submit={() => {
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
      <Button
        icon="search"
        on:click={() => {
          page = 1;
        }}
      >
        Vyhledat
      </Button>
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
    <table class="user-table">
      <tr>
        <th>Jméno</th>
        <th>Role</th>
        <th>Skupiny</th>
      </tr>
      {#each userList.users as user}
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
      total={Math.ceil(userList.count / perPage)}
      bind:current={page}
    />
  {/await}
</div>
