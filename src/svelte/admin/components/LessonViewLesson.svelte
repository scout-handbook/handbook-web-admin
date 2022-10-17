<script lang="ts">
  import { Link } from "svelte-navigator";

  import { adminUri } from "../../../ts/admin/stores";
  import { Competence } from "../../../ts/admin/interfaces/Competence";
  import { IDList } from "../../../ts/admin/IDList";
  import { Lesson } from "../../../ts/admin/interfaces/Lesson";

  export let competences: IDList<Competence>;
  export let adminPermissions: boolean;
  export let id: string;
  export let lesson: Lesson;
  export let secondLevel = false;

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
<Link
  class="button cyan-button changeLesson"
  data-id={id}
  to={"/lessons/" + id + "/edit"}
>
  <i class="icon-pencil" />
  Upravit
</Link>
{#if adminPermissions}
  <Link
    class="button red-button deleteLesson"
    data-id={id}
    state={{ action: "delete-lesson", actionPayload: { lessonId: id } }}
    to="/lessons"
  >
    <i class="icon-trash-empty" />
    Smazat
  </Link>
{/if}
<a
  class="button exportLesson"
  href={$adminUri + "/lesson/" + id}
  rel="noopener noreferrer"
  target="_blank"
>
  <i class="icon-file-pdf" />
  PDF
</a>
<br />
<span class="main-page" class:second-level={secondLevel}>
  {lessonCompetenceList()}
</span>
