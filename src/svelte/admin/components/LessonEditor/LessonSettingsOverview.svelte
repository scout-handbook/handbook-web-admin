<script lang="ts" strictEvents>
  import { useLocation, useNavigate } from "svelte-navigator";

  import { get } from "../../../../ts/admin/tools/arrayTools";
  import Button from "../Button.svelte";
  import CompetenceProvider from "../swr-wrappers/CompetenceProvider.svelte";
  import FieldProvider from "../swr-wrappers/FieldProvider.svelte";
  import GroupProvider from "../swr-wrappers/GroupProvider.svelte";

  export let id: string | null;
  export let field: string | null;
  export let competences: Array<string>;
  export let groups: Array<string>;

  const location = useLocation<Record<string, never>>();
  const navigate = useNavigate();

  $: currentUri = $location.pathname + $location.search;
</script>

<Button
  icon="right-open"
  yellow
  on:click={() => {
    navigate(-1);
  }}
>
  Zavřít
</Button>
{#if id !== null}
  <Button
    icon="history"
    on:click={() => {
      navigate(currentUri, {
        state: { action: "restore-version", view: "lesson-settings" },
      });
    }}
  >
    Historie lekce
  </Button>
{/if}
<br />
<h3 class="side-panel-title no-newline">Oblast</h3>
<Button
  cyan
  icon="pencil"
  on:click={() => {
    navigate(currentUri, {
      state: { action: "change-lesson-field", view: "lesson-settings" },
    });
  }}
>
  Upravit
</Button>
<br />
<FieldProvider inline let:fields>
  {#if field !== null}
    <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
    {get(fields, field)?.name ?? ""}
  {:else}
    <span class="anonymous-field">Nezařazeno</span>
  {/if}
</FieldProvider>
<br />
<h3 class="side-panel-title no-newline">Kompetence</h3>
<Button
  cyan
  icon="pencil"
  on:click={() => {
    navigate(currentUri, {
      state: { action: "change-lesson-competences", view: "lesson-settings" },
    });
  }}
>
  Upravit
</Button>
<CompetenceProvider inline let:competences={allCompetences}>
  <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-argument -->
  {#each allCompetences.filter( ([id, _]) => competences.includes(id) ) as [_, competence]}
    <br />
    <span class="competence-number">{competence.number}:</span>
    {competence.name}
  {/each}
</CompetenceProvider>
<br />
<h3 class="side-panel-title no-newline">Skupiny</h3>
<Button
  cyan
  icon="pencil"
  on:click={() => {
    navigate(currentUri, {
      state: { action: "change-lesson-groups", view: "lesson-settings" },
    });
  }}
>
  Upravit
</Button>
<br />
<div id="settingsGroupList">
  <GroupProvider inline let:groups={allGroups}>
    <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-argument -->
    {#each allGroups.filter(([id, _]) => groups.includes(id)) as [id, group]}
      {#if id === "00000000-0000-0000-0000-000000000000"}
        <span class="public-group">{group.name}</span>
        <br />
      {:else}
        {group.name}
        <br />
      {/if}
    {/each}
  </GroupProvider>
</div>
