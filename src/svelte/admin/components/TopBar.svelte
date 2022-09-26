<script lang="ts">
  import UserAccountBox from "./UserAccountBox.svelte";
  import { showCompetenceSubview } from "../../../ts/admin/views/mainSubviews/competence";
  import { showGroupSubview } from "../../../ts/admin/views/mainSubviews/group";
  import { showImageSubview } from "../../../ts/admin/views/mainSubviews/image";
  import { showLessonSubview } from "../../../ts/admin/views/mainSubviews/lesson";
  import { showUserSubview } from "../../../ts/admin/views/mainSubviews/user";
</script>

<div id="top-bar">
  <UserAccountBox />
  <div
    id="lesson-manager"
    class="top-bar-tab"
    on:click={() => {
      showLessonSubview(false);
    }}
  >
    Lekce
  </div>
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
