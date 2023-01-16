<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { adminUri } from "../../../ts/admin/stores";
  import Button from "./Button.svelte";
  import { Competence } from "../../../ts/admin/interfaces/Competence";
  import { IDList } from "../../../ts/admin/IDList";
  import { Lesson } from "../../../ts/admin/interfaces/Lesson";

  export let competences: IDList<Competence>;
  export let adminPermissions: boolean;
  export let id: string;
  export let lesson: Lesson;
  export let secondLevel = false;

  const navigate = useNavigate();

  function lessonCompetenceList(): string {
    let output = "";
    let first = true;
    competences
      .filter(function (competenceId) {
        return lesson.competences.indexOf(competenceId) >= 0;
      })
      .iterate(function (_, competence) {
        if (!first) {
          output += ", ";
        }
        output += competence.number.toString();
        first = false;
      });
    return "Kompetence: " + output;
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
