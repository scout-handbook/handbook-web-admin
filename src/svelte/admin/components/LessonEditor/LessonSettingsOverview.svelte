<script lang="ts">
  import { useLocation, useNavigate } from "svelte-navigator";

  import Button from "../Button.svelte";
  import { competences, fields, groups } from "../../../../ts/admin/stores";
  import { Group } from "../../../../ts/admin/interfaces/Group";
  import { IDList } from "../../../../ts/admin/IDList";
  import {
    lessonSettingsCache,
    lessonSettingsCacheEvent,
  } from "../../../../ts/admin/lessonEditor/editor";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let lessonId: string | null;

  const location = useLocation();
  const navigate = useNavigate();

  $: lessonCompetences = $competences!
    .filter(function (id) {
      return lessonSettingsCache.competences.indexOf(id) >= 0;
    })
    .asArray();
  $: lessonField = $fields!.get(lessonSettingsCache.field)!;

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
{#if lessonId !== null}
  <Button
    icon="history"
    on:click={() => {
      navigate($location.pathname + $location.search, {
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
    navigate($location.pathname + $location.search, {
      state: { action: "change-lesson-field", view: "lesson-settings" },
    });
  }}
>
  Upravit
</Button>
<br />
{#if !lessonSettingsCache.field}
  <span class="anonymous-field">Nezařazeno</span>
{:else}
  {lessonField.name}
{/if}
<br />
<h3 class="side-panel-title no-newline">Kompetence</h3>
<Button
  cyan
  icon="pencil"
  on:click={() => {
    navigate($location.pathname + $location.search, {
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
    navigate($location.pathname + $location.search, {
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
