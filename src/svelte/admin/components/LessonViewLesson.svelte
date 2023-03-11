<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { adminUri } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import Button from "./Button.svelte";
  import CompetenceProvider from "./swr-wrappers/CompetenceProvider.svelte";

  export let id: string;
  export let lesson: Lesson;
  export let secondLevel = false;

  const navigate = useNavigate();

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";
</script>

<!-- TODO: Remove? -->
<br />
<h3 class:second-level={secondLevel}>{lesson.name}</h3>
<Button
  cyan
  icon="pencil"
  on:click={() => {
    navigate("/lessons/" + id + "/edit");
  }}
>
  Upravit
</Button>
{#if adminOrSuperuser}
  <Button
    icon="trash-empty"
    red
    on:click={() => {
      navigate("/lessons", {
        state: { action: "delete-lesson", actionPayload: { lessonId: id } },
      });
    }}
  >
    Smazat
  </Button>
{/if}
<Button
  icon="file-pdf"
  on:click={() => {
    window.open($adminUri + "/lesson/" + id, "_blank", "noopener,noreferrer");
  }}
>
  PDF
</Button>
<br />
<span class:second-level={secondLevel}>
  Kompetence:
  <CompetenceProvider silent let:competences>
    <!-- eslint-disable @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-argument @typescript-eslint/no-unsafe-return -->
    {competences
      .filter(([competenceId, _]) => lesson.competences.includes(competenceId))
      .map(([_, competence]) => competence.number)
      .join(", ")}
    <!-- eslint-enable -->
  </CompetenceProvider>
</span>

<style>
  h3 {
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 15px;
    margin-top: 1.9em;
  }

  .second-level {
    margin-left: 40px;
  }
</style>
