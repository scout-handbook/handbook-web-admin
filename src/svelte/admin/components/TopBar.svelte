<script lang="ts">
  import { Link } from "svelte-navigator";

  import UserAccountBox from "./UserAccountBox.svelte";
  import { showCompetenceSubview } from "../../../ts/admin/views/mainSubviews/competence";
  import { showGroupSubview } from "../../../ts/admin/views/mainSubviews/group";
  import { showImageSubview } from "../../../ts/admin/views/mainSubviews/image";
  import { showUserSubview } from "../../../ts/admin/views/mainSubviews/user";
</script>

<div id="top-bar">
  <UserAccountBox />
  <Link id="lesson-manager" class="top-bar-tab" to="/lessons">Lekce</Link>
  <div
    id="competence-manager"
    class="top-bar-tab"
    on:click={() => {
      showCompetenceSubview(false);
    }}
  >
    Kompetence
  </div>
  <div
    id="image-manager"
    class="top-bar-tab"
    on:click={() => {
      showImageSubview(false);
    }}
  >
    Obrázky
  </div>
  <div
    id="user-manager"
    class="top-bar-tab"
    on:click={() => {
      showUserSubview(false);
    }}
  >
    Uživatelé
  </div>
  <div
    id="group-manager"
    class="top-bar-tab"
    on:click={() => {
      showGroupSubview(false);
    }}
  >
    Uživatelské skupiny
  </div>
</div>
