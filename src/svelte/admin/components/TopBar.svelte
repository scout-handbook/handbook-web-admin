<script lang="ts" strictEvents>
  import { Link, useMatch } from "svelte-navigator";

  import UserAccountBox from "./UserAccountBox.svelte";

  const lessonMatcher = useMatch("/lessons");
  const competenceMatcher = useMatch("/competences");
  const imageMatcher = useMatch("/images");
  const userMatcher = useMatch("/users");
  const groupMatcher = useMatch("/groups");
</script>

<div class="wrapper">
  <UserAccountBox />
  <div class="lessons tab" class:active-tab={$lessonMatcher !== null}>
    <Link to="/lessons">Lekce</Link>
  </div>
  <div class="competences tab" class:active-tab={$competenceMatcher !== null}>
    <Link to="/competences">Kompetence</Link>
  </div>
  <div class="images tab" class:active-tab={$imageMatcher !== null}>
    <Link to="/images">Obrázky</Link>
  </div>
  <div class="users tab" class:active-tab={$userMatcher !== null}>
    <Link to="/users">Uživatelé</Link>
  </div>
  <div class="groups tab" class:active-tab={$groupMatcher !== null}>
    <Link to="/groups">Uživatelské skupiny</Link>
  </div>
</div>

<style>
  .tab {
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    color: var(--background);
    cursor: pointer;
    display: inline-block;
    font-size: 1.1em;
    font-weight: bold;
    height: 52px;
    margin-left: -1px;
    padding-top: 28px;
    position: absolute;
    text-align: center;
    transition: color ease 0.15s, border-color ease 0.15s,
      background-color ease 0.15s;
    width: 140px;
  }

  .active-tab,
  .tab:hover {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    color: var(--accent-color);
    z-index: 1;
  }

  .lessons {
    left: 301px;
  }

  .competences {
    left: 442px;
  }

  .images {
    left: 583px;
  }

  .users {
    left: 724px;
  }

  .groups {
    left: 865px;
    padding-bottom: 11px;
    padding-top: 17px;
  }

  .wrapper {
    background-color: var(--background-darker);
    border-bottom: 1px solid var(--border-color);
    height: 80px;
  }
</style>
