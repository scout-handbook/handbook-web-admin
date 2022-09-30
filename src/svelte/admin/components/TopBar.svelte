<script lang="ts">
  import { Link } from "svelte-navigator";

  import UserAccountBox from "./UserAccountBox.svelte";
</script>

<div id="top-bar">
  <UserAccountBox />
  <Link id="lesson-manager" class="top-bar-tab" to="/lessons">Lekce</Link>
  <Link id="competence-manager" class="top-bar-tab" to="/competences">
    Kompetence
  </Link>
  <Link id="image-manager" class="top-bar-tab" to="/images">Obrázky</Link>
  <Link id="user-manager" class="top-bar-tab" to="/users">Uživatelé</Link>
  <Link id="group-manager" class="top-bar-tab" to="/groups">
    Uživatelské skupiny
  </Link>
</div>
