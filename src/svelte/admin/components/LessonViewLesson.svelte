<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../ts/admin/interfaces/Competence";
  import type { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import { adminUri } from "../../../ts/admin/stores";
  import Button from "./Button.svelte";

  export let competences: Array<[string, Competence]>;
  export let adminPermissions: boolean;
  export let id: string;
  export let lesson: Lesson;
  export let secondLevel = false;

  const navigate = useNavigate();

  function lessonCompetenceList(): string {
    return (
      "Kompetence: " +
      competences
        .filter(([competenceId, _]) =>
          lesson.competences.includes(competenceId)
        )
        .map(([_, competence]) => competence.number)
        .join(", ")
    );
  }
</script>

<br />
<h3 class="main-page" class:second-level={secondLevel}>{lesson.name}</h3>
<Button
  cyan
  icon="pencil"
  on:click={() => {
    navigate("/lessons/" + id + "/edit");
  }}
>
  Upravit
</Button>
{#if adminPermissions}
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
<span class="main-page" class:second-level={secondLevel}>
  {lessonCompetenceList()}
</span>
