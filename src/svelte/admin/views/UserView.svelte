<script lang="ts">
  import { changeUserGroupsOnClick } from "../../ts/admin/actions/changeUserGroups";
  import { changeUserRoleOnClick } from "../../ts/admin/actions/changeUserRole";
  import { config } from "../../ts/admin/stores";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { Group } from "../../ts/admin/interfaces/Group";
  import { IDList } from "../../ts/admin/IDList";
  import { Loginstate } from "../../ts/admin/interfaces/Loginstate";
  import { Payload } from "../../ts/admin/interfaces/Payload";
  import { reAuthHandler, request } from "../../ts/admin/tools/request";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";
  import { renderPagination } from "../../ts/admin/UI/pagination";
  import { RequestResponse } from "../../ts/admin/interfaces/RequestResponse";
  import { Role } from "../../ts/admin/interfaces/Role";
  import { User } from "../../ts/admin/interfaces/User";
  import { UserListResponse } from "../../ts/admin/interfaces/UserListResponse";
  import { UserSearchQuery } from "../../ts/admin/interfaces/UserSearchQuery";

  export let groups: IDList<Group>;
  export let loginstate: Loginstate;

  let page = 1;
  const perPage = 25;
  let role: Role | "all" = "all";
  let searchName = "";
  let group = "00000000-0000-0000-0000-000000000000";

  let userListPromise: Promise<UserListResponse>;

  function reload() {
    userListPromise = new Promise((resolve) => {
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
        $config["api-uri"] + "/v1.0/user",
        "GET",
        payload as unknown as Payload,
        function (response: RequestResponse): void {
          resolve(response as UserListResponse);
        },
        reAuthHandler
      );
    });
    fixNavigation();
  }

  // TODO: Remove this horrible hack
  function fixNavigation() {
    void userListPromise.then(() => {
      setTimeout(() => {
        const paginationNodes = getElementsByClassName("pagination-button");
        for (let i = 0; i < paginationNodes.length; i++) {
          (paginationNodes[i] as HTMLElement).onclick = function (event): void {
            page = parseInt((event.target as HTMLElement).dataset.page!, 10);
            reload();
          };
        }
      }, 100);
    });
  }

  reload();
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

<h1>{$config["site-name"] + " - Uživatelé"}</h1>
<div id="userList">
  {#await userListPromise}
    <div id="embedded-spinner" />
  {:then userList}
    <form
      id="user-search-form"
      on:submit={() => {
        page = 1;
        reload();
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
      <div
        id="user-search-button"
        class="button"
        on:click={() => {
          page = 1;
          reload();
        }}
      >
        <i class="icon-search" />
        Vyhledat
      </div>
      {#if searchName || role !== "all" || group !== "00000000-0000-0000-0000-000000000000"}
        <div
          id="user-search-cancel"
          class="button yellow-button"
          on:click={() => {
            page = 1;
            role = "all";
            searchName = "";
            group = "00000000-0000-0000-0000-000000000000";
            reload();
          }}
        >
          <i class="icon-cancel" />
          Zrušit
        </div>
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
              <div
                class="button cyan-button changeUserRole"
                data-id={user.id.toString()}
                data-name={user.name}
                data-role={user.role}
                on:click={changeUserRoleOnClick}
              >
                <i class="icon-pencil" />
                Upravit
              </div>
              <br />
            {/if}
          </td>
          <td>
            {groupsList(user)}
            {#if user.groups.length > 0}
              <br />
            {/if}
            <div
              class="button cyan-button changeUserGroups"
              data-groups={JSON.stringify(user.groups)}
              data-id={user.id.toString()}
              data-name={user.name}
              on:click={changeUserGroupsOnClick}
            >
              <i class="icon-pencil" />
              Upravit
            </div>
          </td>
        </tr>
      {/each}
    </table>
    {@html renderPagination(Math.ceil(userList.count / perPage), page)}
  {/await}
</div>
