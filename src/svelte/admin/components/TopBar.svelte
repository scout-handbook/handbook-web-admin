<script lang="ts">
  import { Link } from "svelte-navigator";

  import UserAccountBox from "./UserAccountBox.svelte";
  import { showGroupSubview } from "../../../ts/admin/views/mainSubviews/group";
  import { showUserSubview } from "../../../ts/admin/views/mainSubviews/user";
</script>

<div id="top-bar">
  <UserAccountBox />
  <Link id="lesson-manager" class="top-bar-tab" to="/lessons">Lekce</Link>
  <Link
    id="competence-manager"
    class="top-bar-tab"
    to="/competences"
  >
    Kompetence
  </Link>
  <Link
    id="image-manager"
    class="top-bar-tab"
    to="/images"
  >
    Obrázky
  </Link>
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
