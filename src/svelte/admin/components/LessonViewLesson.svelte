<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../ts/admin/interfaces/Competence";
  import type { Lesson } from "../../../ts/admin/interfaces/Lesson";
  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";
  import { adminUri } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/tools/constructURL";
  import Button from "./Button.svelte";

  export let competences: Array<[string, Competence]>;
  export let id: string;
  export let lesson: Lesson;
  export let secondLevel = false;

  const navigate = useNavigate();

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: adminOrSuperuser =
    $loginstate?.role === "administrator" || $loginstate?.role === "superuser";

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
<span class="main-page" class:second-level={secondLevel}>
  {lessonCompetenceList()}
</span>
