<script lang="ts" strictEvents>
  import { useLocation } from "svelte-navigator";

  import type { Payload } from "../../../ts/admin/interfaces/Payload";
  import type { Role } from "../../../ts/admin/interfaces/Role";
  import type { User } from "../../../ts/admin/interfaces/User";
  import type { UserListResponse } from "../../../ts/admin/interfaces/UserListResponse";
  import { apiUri, siteName } from "../../../ts/admin/stores";
  import { refreshLogin } from "../../../ts/admin/tools/refreshLogin";
  import { reAuthHandler, request } from "../../../ts/admin/tools/request";
  import ChangeUserGroupsPanel from "../components/action-modals/ChangeUserGroupsPanel.svelte";
  import ChangeUserRolePanel from "../components/action-modals/ChangeUserRolePanel.svelte";
  import LoadingIndicator from "../components/LoadingIndicator.svelte";
  import Pagination from "../components/Pagination.svelte";
  import GroupProvider from "../components/swr-wrappers/GroupProvider.svelte";
  import UserViewSearchForm from "../components/UserViewSearchForm.svelte";
  import UserViewTable from "../components/UserViewTable.svelte";

  const location = useLocation<{
    action: string;
    actionPayload: { user: User };
  }>();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: action = $location.state?.action;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  $: actionPayload = $location.state?.actionPayload;

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
  <GroupProvider silent let:groups>
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
    <UserViewSearchForm
      bind:searchName
      bind:role
      bind:group
      on:change={() => {
        page = 1;
      }}
    />
    <UserViewTable {userList} />
    <Pagination
      total={Math.ceil(userList.count / perPage)}
      bind:current={page}
    />
  {/await}
</div>
