<script lang="ts" strictEvents>
  import { useMatch, useNavigate } from "svelte-navigator";

  import UserAccountBox from "./UserAccountBox.svelte";

  const navigate = useNavigate();
  const rootMatcher = useMatch("/");
  const lessonMatcher = useMatch("/lessons");
  const competenceMatcher = useMatch("/competences");
  const imageMatcher = useMatch("/images");
  const userMatcher = useMatch("/users");
  const groupMatcher = useMatch("/groups");
</script>

<div class="wrapper">
  <UserAccountBox />
  <!-- TODO: Remove manual positioning -->
  <div
    class="lessons tab"
    class:active-tab={$rootMatcher !== null || $lessonMatcher !== null}
    on:click={() => {
      navigate("/lessons");
    }}
    on:keypress={() => {
      navigate("/lessons");
    }}
  >
    Lekce
  </div>
  <div
    class="competences tab"
    class:active-tab={$competenceMatcher !== null}
    on:click={() => {
      navigate("/competences");
    }}
    on:keypress={() => {
      navigate("/competences");
    }}
  >
    Kompetence
  </div>
  <div
    class="images tab"
    class:active-tab={$imageMatcher !== null}
    on:click={() => {
      navigate("/images");
    }}
    on:keypress={() => {
      navigate("/images");
    }}
  >
    Obrázky
  </div>
  <div
    class="users tab"
    class:active-tab={$userMatcher !== null}
    on:click={() => {
      navigate("/users");
    }}
    on:keypress={() => {
      navigate("/users");
    }}
  >
    Uživatelé
  </div>
  <div
    class="groups tab"
    class:active-tab={$groupMatcher !== null}
    on:keypress={() => {
      navigate("/groups");
    }}
    on:click={() => {
      navigate("/groups");
    }}
  >
    Uživatelské skupiny
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
