<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import { IDList } from "../../../../ts/admin/IDList";
  import { Group } from "../../../../ts/admin/interfaces/Group";
  import {
    lessonSettingsCache,
    lessonSettingsCacheEvent,
  } from "../../../../ts/admin/lessonEditor/editor";
  import { competences, fields, groups } from "../../../../ts/admin/stores";
  import Button from "../Button.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let id: string | null;
  export let field: string | null;

  const location = useLocation();
  const navigate = useNavigate();

  $: lessonCompetences = $competences!
    .filter(function (id) {
      return lessonSettingsCache.competences.indexOf(id) >= 0;
    })
    .asArray();
  $: fieldName = field !== null ? $fields?.get(field)?.name : undefined;
  $: currentUri = $location.pathname + $location.search;

  const groupsPromise = new Promise<IDList<Group>>((resolve) => {
    lessonSettingsCacheEvent.addCallback(() => {
      resolve(
        $groups!.filter(function (id) {
          return lessonSettingsCache.groups.indexOf(id) >= 0;
        })
      );
    });
  });
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
{#if fieldName}
  {fieldName}
{:else}
  <span class="anonymous-field">Nezařazeno</span>
{/if}
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
{#each lessonCompetences as { id: _, value: competence }}
  <br />
  <span class="competence-number">{competence.number}:</span>
  {competence.name}
{/each}
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
  {#await groupsPromise}
    <LoadingIndicator />
  {:then groups}
    {#each groups.asArray() as { id, value: group }}
      {#if id === "00000000-0000-0000-0000-000000000000"}
        <span class="public-group">{group.name}</span>
        <br />
      {:else}
        {group.name}
        <br />
      {/if}
    {/each}
  {/await}
</div>
