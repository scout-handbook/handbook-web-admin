<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import type { Field } from "../../../../ts/admin/interfaces/Field";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import {
    processCompetences,
    processFields,
    processLessons,
  } from "../../../../ts/admin/swr";
  import { constructURL } from "../../../../ts/admin/utils/constructURL";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  interface $$Slots {
    default: {
      competences: Array<[string, Competence]>;
      lessons: Array<[string, Lesson]>;
      fields: Array<[string, Field]>;
    };
  }

  export let silent = false;
  export let inline = false;

  const { data: rawCompetences } = useSWR<Record<string, Competence>>(
    constructURL("v1.0/competence")
  );
  const { data: rawLessons } = useSWR<Record<string, Lesson>>(
    constructURL("v1.0/lesson?override-group=true")
  );
  const { data: rawFields } = useSWR<Record<string, Field>>(
    constructURL("v1.0/field?override-group=true")
  );
  const competences = derived(rawCompetences, processCompetences, undefined);
  const lessons = derived([rawLessons, competences], processLessons, undefined);
  const fields = derived(
    [rawFields, lessons, competences],
    processFields,
    undefined,
  );
</script>

{#if $competences === undefined || $lessons === undefined || $fields === undefined}
  {#if !silent}
    <LoadingIndicator {inline} />
  {/if}
{:else}
  <slot competences={$competences} fields={$fields} lessons={$lessons} />
{/if}
