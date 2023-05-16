<script lang="ts" strictEvents>
  import { useLocation, useNavigate } from "svelte-navigator";

  import { get } from "../../../../ts/admin/utils/arrayUtils";
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
<h1>Oblast</h1>
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
    <span class="anonymous">Nezařazeno</span>
  {/if}
</FieldProvider>
<br />
<h1>Kompetence</h1>
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
  {#each allCompetences.filter( ([id, _]) => competences.includes(id) ) as [id, competence] (id)}
    <br />
    <span class="competence-number">{competence.number}:</span>
    {competence.name}
  {/each}
</CompetenceProvider>
<br />
<h1>Skupiny</h1>
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
<GroupProvider inline let:groups={allGroups}>
  <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-argument -->
  {#each allGroups.filter(([id, _]) => groups.includes(id)) as [id, group] (id)}
    {#if id === "00000000-0000-0000-0000-000000000000"}
      <span class="public">{group.name}</span>
      <br />
    {:else}
      {group.name}
      <br />
    {/if}
  {/each}
</GroupProvider>

<style>
  .competence-number {
    font-weight: bold;
  }

  .anonymous,
  .public {
    font-style: italic;
  }

  h1 {
    display: inline-block;
    margin-right: 15px;
  }
</style>
