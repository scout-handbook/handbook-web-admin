<script lang="ts" strictEvents>
  import { pushState } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import CompetenceProvider from "$lib/components/swr-wrappers/CompetenceProvider.svelte";
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import { get } from "$lib/utils/arrayUtils";

  export let id: string | null;
  export let field: string | null;
  export let competences: Array<string>;
  export let groups: Array<string>;
</script>

<Button
  icon="right-open"
  yellow
  on:click={() => {
    history.back();
  }}
>
  Zavřít
</Button>
{#if id !== null}
  <Button
    icon="history"
    on:click={() => {
      pushState("", {
        action: "restore-version",
        view: "lesson-settings",
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
    pushState("", {
      action: "change-lesson-field",
      view: "lesson-settings",
    });
  }}
>
  Upravit
</Button>
<br />
<FieldProvider inline let:fields>
  {#if field !== null}
    {get(fields, field)?.name ?? ""}
  {:else}
    <span class="anonymous">Nezařazeno</span>
  {/if}
</FieldProvider>
<br />
<h1>Body</h1>
<Button
  cyan
  icon="pencil"
  on:click={() => {
    pushState("", {
      action: "change-lesson-competences",
      view: "lesson-settings",
    });
  }}
>
  Upravit
</Button>
<CompetenceProvider inline let:competences={allCompetences}>
  {#each allCompetences.filter( ([competenceId, _]) => competences.includes(competenceId), ) as [competenceId, competence] (competenceId)}
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
    pushState("", {
      action: "change-lesson-groups",
      view: "lesson-settings",
    });
  }}
>
  Upravit
</Button>
<br />
<GroupProvider inline let:groups={allGroups}>
  {#each allGroups.filter( ([groupId, _]) => groups.includes(groupId), ) as [groupId, group] (groupId)}
    {#if groupId === "00000000-0000-0000-0000-000000000000"}
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
