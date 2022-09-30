<script lang="ts">
  import { Link, useMatch } from "svelte-navigator";

  import UserAccountBox from "./UserAccountBox.svelte";

  const lessonMatcher = useMatch("/lessons");
  const competenceMatcher = useMatch("/competences");
  const imageMatcher = useMatch("/images");
  const userMatcher = useMatch("/users");
  const groupMatcher = useMatch("/groups");
</script>

<div id="top-bar">
  <UserAccountBox />
  <Link
    id="lesson-manager"
    class={"top-bar-tab" +
      ($lessonMatcher !== null ? " active-top-bar-tab" : "")}
    to="/lessons"
  >
    Lekce
  </Link>
  <Link
    id="competence-manager"
    class={"top-bar-tab" +
      ($competenceMatcher !== null ? " active-top-bar-tab" : "")}
    to="/competences"
  >
    Kompetence
  </Link>
  <Link
    id="image-manager"
    class={"top-bar-tab" +
      ($imageMatcher !== null ? " active-top-bar-tab" : "")}
    to="/images"
  >
    Obrázky
  </Link>
  <Link
    id="user-manager"
    class={"top-bar-tab" + ($userMatcher !== null ? " active-top-bar-tab" : "")}
    to="/users"
  >
    Uživatelé
  </Link>
  <Link
    id="group-manager"
    class={"top-bar-tab" +
      ($groupMatcher !== null ? " active-top-bar-tab" : "")}
    to="/groups"
  >
    Uživatelské skupiny
  </Link>
</div>
