<script lang="ts" strictEvents>
  import { createQuery } from "@tanstack/svelte-query";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";

  import { processCompetences } from "../../../../ts/admin/swr";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let silent = false;
  export let inline = false;

  interface $$Slots {
    default: { competences: Array<[string, Competence]> };
  }

  const competenceQuery = createQuery<Record<string, Competence>>({
    queryKey: ["v1.0", "competence"],
  });
  const { data: rawCompetences, isSuccess } = $competenceQuery;
</script>

{#if isSuccess}
  <slot competences={processCompetences(rawCompetences)} />
{:else if !silent}
  <LoadingIndicator {inline} />
{/if}
