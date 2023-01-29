<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";
  import { useLocation, useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import { processCompetences } from "../../../../ts/admin/metadata";
  import { fields, groups as allGroups } from "../../../../ts/admin/stores";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import Button from "../Button.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let id: string | null;
  export let field: string | null;
  export let competences: Array<string>;
  export let groups: Array<string>;

  const location = useLocation();
  const navigate = useNavigate();

  const allCompetences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined
  );
  $: lessonCompetences = $allCompetences?.filter(([id, _]) =>
    competences.includes(id)
  );
  $: fieldName =
    field !== null && $fields !== null ? get($fields, field)?.name : undefined;
  $: lessonGroups = $allGroups!.filter(([id, _]) => groups.includes(id));
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
{#if lessonCompetences === undefined}
  <LoadingIndicator />
{:else}
  {#each lessonCompetences as [_, competence]}
    <br />
    <span class="competence-number">{competence.number}:</span>
    {competence.name}
  {/each}
{/if}
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
  {#each lessonGroups as [id, group]}
    {#if id === "00000000-0000-0000-0000-000000000000"}
      <span class="public-group">{group.name}</span>
      <br />
    {:else}
      {group.name}
      <br />
    {/if}
  {/each}
</div>
