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
  <button
    class:active-tab={$rootMatcher !== null || $lessonMatcher !== null}
    type="button"
    on:click={() => {
      navigate("/lessons");
    }}
  >
    Lekce
  </button>
  <button
    class:active-tab={$competenceMatcher !== null}
    type="button"
    on:click={() => {
      navigate("/competences");
    }}
  >
    Body
  </button>
  <button
    class:active-tab={$imageMatcher !== null}
    type="button"
    on:click={() => {
      navigate("/images");
    }}
  >
    Obrázky
  </button>
  <button
    class:active-tab={$userMatcher !== null}
    type="button"
    on:click={() => {
      navigate("/users");
    }}
  >
    Uživatelé
  </button>
  <button
    class="groups"
    class:active-tab={$groupMatcher !== null}
    type="button"
    on:click={() => {
      navigate("/groups");
    }}
  >
    Uživatelské skupiny
  </button>
</div>

<style>
  button {
    background: none;
    border: none;
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    box-sizing: content-box;
    color: var(--background);
    cursor: pointer;
    display: inline-block;
    font: inherit;
    font-size: 1.1em;
    font-weight: bold;
    height: 52px;
    margin-left: -5px;
    padding: 15px 0 13px 0;
    text-align: center;
    transition:
      color ease 0.15s,
      border-color ease 0.15s,
      background-color ease 0.15s;
    vertical-align: top;
    width: 140px;
  }

  .active-tab,
  button:hover {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  .groups {
    padding-bottom: 12px;
    padding-top: 16px;
  }

  .wrapper {
    background-color: var(--background-darker);
    border-bottom: 1px solid var(--border-color);
    height: 80px;
  }
</style>
