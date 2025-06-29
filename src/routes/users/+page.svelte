<script lang="ts">
  import type { Role } from "$lib/interfaces/Role";
  import type { User } from "$lib/interfaces/User";
  import type { UserListResponse } from "$lib/interfaces/UserListResponse";

  import { page as kitPage } from "$app/state";
  import EditUserGroupsPanel from "$lib/components/action-modals/EditUserGroupsPanel.svelte";
  import EditUserRolePanel from "$lib/components/action-modals/EditUserRolePanel.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import MainPageContainer from "$lib/components/MainPageContainer.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import UserViewSearchForm from "$lib/components/UserViewSearchForm.svelte";
  import UserViewTable from "$lib/components/UserViewTable.svelte";
  import { siteName } from "$lib/config";
  import { createQuery } from "@tanstack/svelte-query";

  let page = $state(1);
  const perPage = 25;
  let role: "all" | Role = $state("all");
  let searchName = $state("");
  let group = $state("00000000-0000-0000-0000-000000000000");

  let payload = $derived({
    group: group !== "00000000-0000-0000-0000-000000000000" ? group : undefined,
    name: searchName,
    page,
    "per-page": perPage,
    role: role !== "all" ? role : undefined,
  });
  let userQuery = $derived(
    createQuery<UserListResponse>({
      queryKey: ["v1.0", "user", payload],
    }),
  );
  let userListCount = $derived($userQuery.data?.count);
  let users: Array<User> | undefined = $derived($userQuery.data?.users);
</script>

<TopBar />
<MainPageContainer>
  {#if kitPage.state.action?.name === "change-user-groups"}
    <EditUserGroupsPanel user={kitPage.state.action.user} />
  {:else if kitPage.state.action?.name === "change-user-role"}
    <EditUserRolePanel user={kitPage.state.action.user} />
  {/if}

  <h1>{`${siteName} - Uživatelé`}</h1>
  <UserViewSearchForm
    onchange={(): void => {
      page = 1;
    }}
    bind:searchName
    bind:role
    bind:group
  />
  {#if users === undefined || userListCount === undefined}
    <LoadingIndicator />
  {:else}
    <UserViewTable {users} />
    <Pagination
      total={Math.ceil(userListCount / perPage)}
      bind:current={page}
    />
  {/if}
</MainPageContainer>
