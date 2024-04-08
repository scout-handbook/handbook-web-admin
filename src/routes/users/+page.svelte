<script lang="ts" strictEvents>
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { useSWR } from "sswr";
  import { page as kitPage } from "$app/stores";
  import EditUserGroupsPanel from "$lib/components/action-modals/EditUserGroupsPanel.svelte";
  import EditUserRolePanel from "$lib/components/action-modals/EditUserRolePanel.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import UserViewSearchForm from "$lib/components/UserViewSearchForm.svelte";
  import UserViewTable from "$lib/components/UserViewTable.svelte";
  import type { Role } from "$lib/interfaces/Role";
  import type { User } from "$lib/interfaces/User";
  import type { UserListResponse } from "$lib/interfaces/UserListResponse";
  import { siteName } from "$lib/stores";
  import { constructURL } from "$lib/utils/constructURL";
  import type { PageStateFix } from "../../app";

  $: state = $kitPage.state as PageStateFix;

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
  $: ({ data: userList, revalidate } = useSWR<UserListResponse>(
    () => constructURL("v1.0/user", payload),
    // TODO: Remove this when ConsoleTVs/sswr#43 is fixed
    { dedupingInterval: 0 },
  ));
  $: userListCount = $userList?.count;
  let users: Array<User> | undefined;
  $: users = $userList?.users;
</script>

<TopBar />
<MainPageContainer>
  {#if state.action === "change-user-groups"}
    <GroupProvider silent let:groups>
      <EditUserGroupsPanel {groups} payload={state.actionPayload} {revalidate} />
    </GroupProvider>
  {:else if state.action === "change-user-role"}
    <EditUserRolePanel payload={state.actionPayload} {revalidate} />
  {/if}

  <h1>{$siteName + " - Uživatelé"}</h1>
  <UserViewSearchForm
    bind:searchName
    bind:role
    bind:group
    on:change={() => {
      page = 1;
    }}
  />
  {#if users === undefined || userListCount === undefined}
    <LoadingIndicator />
  {:else}
    <UserViewTable {users} />
    <Pagination total={Math.ceil(userListCount / perPage)} bind:current={page} />
  {/if}
</MainPageContainer>
