<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import type { Payload } from "../../../ts/admin/interfaces/Payload";
  import type { Role } from "../../../ts/admin/interfaces/Role";
  import type { User } from "../../../ts/admin/interfaces/User";
  import type { UserListResponse } from "../../../ts/admin/interfaces/UserListResponse";
  import { apiUri, siteName } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import ChangeUserGroupsPanel from "../components/action-modals/ChangeUserGroupsPanel.svelte";
  import ChangeUserRolePanel from "../components/action-modals/ChangeUserRolePanel.svelte";
  import Button from "../components/Button.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Pagination from "../components/Pagination.svelte";
  import GroupProvider from "../components/swr-wrappers/GroupProvider.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { user: User };
  }>();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: isSuperuser = $loginstate?.role === "superuser";
  $: adminOrSuperuser = $loginstate?.role === "administrator" || isSuperuser;

  let page = 1;
  const perPage = 25;
  let role: Role | "all" = "all";
  let searchName = "";
  let group = "00000000-0000-0000-0000-000000000000";

  let userListPromise: Promise<UserListResponse>;

  $: payload = {
    name: searchName,
    page: page,
    "per-page": perPage,
    role: role !== "all" ? role : undefined,
    group: group !== "00000000-0000-0000-0000-000000000000" ? group : undefined,
  };
  $: userListPromise = request(
    $apiUri + "/v1.0/user",
    "GET",
    payload as unknown as Payload,
    reAuthHandler
  );

  refreshLogin(true);
</script>

{#if action === "change-user-groups"}
  <GroupProvider let:groups>
    <ChangeUserGroupsPanel {groups} payload={actionPayload} />
  </GroupProvider>
{:else if action === "change-user-role"}
  <ChangeUserRolePanel payload={actionPayload} />
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
      {#if adminOrSuperuser}
        <select id="role-search-filter" class="form-select" bind:value={role}>
          <option id="all" class="select-filter-special" value="all">
            Všechny role
          </option>
          <option id="user" value="user">Uživatel</option>
          <option id="editor" value="editor">Editor</option>
          {#if isSuperuser}
            <option id="administrator" value="administrator">
              Administrátor
            </option>
            <option id="superuser" value="superuser">Superuser</option>
          {/if}
        </select>
      {/if}
      <GroupProvider silent let:groups>
        <select id="group-search-filter" class="form-select" bind:value={group}>
          <option
            id="00000000-0000-0000-0000-000000000000"
            class="select-filter-special"
            value="00000000-0000-0000-0000-000000000000"
          >
            Všechny skupiny
          </option>
          <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call -->
          {#each groups.filter(([id, _]) => id !== "00000000-0000-0000-0000-000000000000") as [id, group]}
            <option {id} value={id}>{group.name}</option>
          {/each}
        </select>
      </GroupProvider>
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
              <!-- eslint-disable @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-argument @typescript-eslint/no-unsafe-return -->
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
    <Pagination
      total={Math.ceil(userList.count / perPage)}
      bind:current={page}
    />
  {/await}
</div>
