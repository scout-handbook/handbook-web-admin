<script lang="ts">
  import { addCompetence } from "../../ts/admin/actions/addCompetence";
  import { addOnClicks } from "../../ts/admin/tools/addOnClicks";
  import { changeCompetenceOnClick } from "../../ts/admin/actions/changeCompetence";
  import { Competence } from "../../ts/admin/interfaces/Competence";
  import { config } from "../../ts/admin/stores";
  import { deleteCompetenceOnClick } from "../../ts/admin/actions/deleteCompetence";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";
  import { IDList } from "../../ts/admin/IDList";
  import { Loginstate } from "../../ts/admin/interfaces/Loginstate";
  import { refreshLogin } from "../../ts/admin/tools/refreshLogin";
  import { renderCompetenceList } from "../../ts/admin/views/mainSubviews/competence";

  export let competences: IDList<Competence>;
  export let loginstate: Loginstate;

  $: adminPermissions = loginstate.role === "administrator" || loginstate.role === "superuser";

  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("competence-manager")!.className +=
    " active-top-bar-tab";

  if (adminPermissions) {
    document.getElementById("addCompetence")!.onclick = addCompetence;
  }

  addOnClicks("change-competence", changeCompetenceOnClick);
  addOnClicks("delete-competence", deleteCompetenceOnClick);
  refreshLogin(true);
</script>

<h1>{$config["site-name"] + " - Kompetence"}</h1>
{#if adminPermissions}
  <div class="button green-button" id="addCompetence">
    <i class="icon-plus" />
    Přidat
  </div>
  <br />
{/if}
{@html renderCompetenceList()}
