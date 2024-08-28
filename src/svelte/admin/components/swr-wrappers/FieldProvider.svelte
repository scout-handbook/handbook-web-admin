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
      fields: Array<[string, Field]>;
      lessons: Array<[string, Lesson]>;
    };
  }

  export let silent = false;
  export let inline = false;

  const competences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined,
  );
  const lessons = derived(
    [
      useSWR<Record<string, Lesson>>(
        constructURL("v1.0/lesson?override-group=true"),
      ).data,
      competences,
    ],
    processLessons,
    undefined,
  );
  const fields = derived(
    [
      useSWR<Record<string, Field>>(
        constructURL("v1.0/field?override-group=true"),
      ).data,
      lessons,
      competences,
    ],
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
