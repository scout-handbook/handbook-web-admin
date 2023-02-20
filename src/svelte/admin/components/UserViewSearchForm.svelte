<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { createEventDispatcher } from "svelte";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import type { Role } from "../../../ts/admin/interfaces/Role";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import Button from "../components/Button.svelte";
  import GroupProvider from "../components/swr-wrappers/GroupProvider.svelte";

  export let group: string;
  export let role: Role | "all";
  export let searchName: string;

  const dispatch = createEventDispatcher<{ change: never }>();

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: isSuperuser = $loginstate?.role === "superuser";
  $: adminOrSuperuser = $loginstate?.role === "administrator" || isSuperuser;
</script>

<form
  class="search-form"
  on:submit={() => {
    dispatch("change");
  }}
>
  <input
    class="form-text search-box"
    placeholder="Jméno uživatele"
    type="text"
    bind:value={searchName}
  />
  {#if adminOrSuperuser}
    <select class="form-select filter-select" bind:value={role}>
      <option id="all" class="filter-special" value="all">
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
    <select class="form-select filter-select" bind:value={group}>
      <option
        id="00000000-0000-0000-0000-000000000000"
        class="filter-special"
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
      dispatch("change");
    }}
  >
    Vyhledat
  </Button>
  {#if searchName || role !== "all" || group !== "00000000-0000-0000-0000-000000000000"}
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        role = "all";
        searchName = "";
        group = "00000000-0000-0000-0000-000000000000";
        dispatch("change");
      }}
    >
      Zrušit
    </Button>
  {/if}
</form>

<style>
  .search-box {
    margin-right: 10px;
    width: 151px;
  }

  .search-form {
    margin-bottom: 30px;
  }

  .filter-select {
    margin-right: 10px;
  }

  .filter-special {
    font-style: italic;
  }
</style>
