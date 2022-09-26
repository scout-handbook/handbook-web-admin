<script lang="ts">
  import { Link } from "svelte-navigator";

  import { Competence } from "../../ts/admin/interfaces/Competence";
  import { config } from "../../ts/admin/stores";
  import { deleteLessonOnClick } from "../../ts/admin/actions/deleteLesson";
  import { IDList } from "../../ts/admin/IDList";
  import { Lesson } from "../../ts/admin/interfaces/Lesson";

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
  <div
    class="button red-button deleteLesson"
    data-id={id}
    on:click={deleteLessonOnClick}
  >
    <i class="icon-trash-empty" />
    Smazat
  </div>
{/if}
<a
  class="button exportLesson"
  href={$config["admin-uri"] + "/lesson/" + id}
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
