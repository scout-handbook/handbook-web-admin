<script lang="ts">
  import { pushState } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import CompetenceProvider from "$lib/components/swr-wrappers/CompetenceProvider.svelte";
  import FieldProvider from "$lib/components/swr-wrappers/FieldProvider.svelte";
  import GroupProvider from "$lib/components/swr-wrappers/GroupProvider.svelte";
  import { get } from "$lib/utils/arrayUtils";

  interface Props {
    competences: Array<string>;
    field: string | null;
    groups: Array<string>;
    id: string | null;
  }

  let { competences, field, groups, id }: Props = $props();
</script>

<Button
  icon="right-open"
  onclick={() => {
    history.back();
  }}
  yellow
>
  Zavřít
</Button>
{#if id !== null}
  <Button
    icon="history"
    onclick={() => {
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
  onclick={() => {
    pushState("", {
      action: "change-lesson-field",
      view: "lesson-settings",
    });
  }}
>
  Upravit
</Button>
<br />
<FieldProvider inline>
  {#snippet children(_, fields)}
    {#if field !== null}
      {get(fields, field)?.name ?? ""}
    {:else}
      <span class="anonymous">Nezařazeno</span>
    {/if}
  {/snippet}
</FieldProvider>
<br />
<h1>Body</h1>
<Button
  cyan
  icon="pencil"
  onclick={() => {
    pushState("", {
      action: "change-lesson-competences",
      view: "lesson-settings",
    });
  }}
>
  Upravit
</Button>
<CompetenceProvider inline>
  {#snippet children(allCompetences)}
    {#each allCompetences.filter( ([competenceId, _]) => competences.includes(competenceId), ) as [competenceId, competence] (competenceId)}
      <br />
      <span class="competence-number">{competence.number}:</span>
      {competence.name}
    {/each}
  {/snippet}
</CompetenceProvider>
<br />
<h1>Skupiny</h1>
<Button
  cyan
  icon="pencil"
  onclick={() => {
    pushState("", {
      action: "change-lesson-groups",
      view: "lesson-settings",
    });
  }}
>
  Upravit
</Button>
<br />
<GroupProvider inline>
  {#snippet children(allGroups)}
    {#each allGroups.filter( ([groupId, _]) => groups.includes(groupId), ) as [groupId, group] (groupId)}
      {#if groupId === "00000000-0000-0000-0000-000000000000"}
        <span class="public">{group.name}</span>
        <br />
      {:else}
        {group.name}
        <br />
      {/if}
    {/each}
  {/snippet}
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
