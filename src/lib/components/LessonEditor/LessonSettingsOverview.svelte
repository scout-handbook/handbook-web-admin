<script lang="ts">
  import { pushState } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import {
    competences as allCompetences,
    sortCompetences,
  } from "$lib/resources/competences.svelte";
  import { fields } from "$lib/resources/fields.svelte";
  import {
    groups as allGroups,
    sortGroups,
  } from "$lib/resources/groups.svelte";
  import { filter } from "$lib/utils/mapUtils";

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
  onclick={(): void => {
    history.back();
  }}
  yellow
>
  Zavřít
</Button>
{#if id !== null}
  <Button
    icon="history"
    onclick={(): void => {
      pushState("", {
        action: {
          name: "restore-version",
          view: "lesson-settings",
        },
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
  onclick={(): void => {
    pushState("", {
      action: {
        name: "change-lesson-field",
        view: "lesson-settings",
      },
    });
  }}
>
  Upravit
</Button>
<br />
{#if field === null}
  <span class="anonymous">Nezařazeno</span>
{:else if fields.current === undefined}
  <LoadingIndicator inline />
{:else}
  {fields.current.get(field)?.name ?? ""}
{/if}
<br />
<h1>Body</h1>
<Button
  cyan
  icon="pencil"
  onclick={(): void => {
    pushState("", {
      action: {
        name: "change-lesson-competences",
        view: "lesson-settings",
      },
    });
  }}
>
  Upravit
</Button>
{#if allCompetences.current === undefined}
  <LoadingIndicator inline />
{:else}
  {#each sortCompetences(filter( allCompetences.current, (competenceId) => competences.includes(competenceId), )) as [competenceId, competence] (competenceId)}
    <br />
    <span class="competence-number">{competence.number}:</span>
    {competence.name}
  {/each}
{/if}
<br />
<h1>Skupiny</h1>
<Button
  cyan
  icon="pencil"
  onclick={(): void => {
    pushState("", {
      action: {
        name: "change-lesson-groups",
        view: "lesson-settings",
      },
    });
  }}
>
  Upravit
</Button>
<br />
{#if allGroups.current === undefined}
  <LoadingIndicator inline />
{:else}
  {#each sortGroups(filter( allGroups.current, (groupId) => groups.includes(groupId), )) as [groupId, group] (groupId)}
    {#if groupId === "00000000-0000-0000-0000-000000000000"}
      <span class="public">{group.name}</span>
      <br />
    {:else}
      {group.name}
      <br />
    {/if}
  {/each}
{/if}

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
