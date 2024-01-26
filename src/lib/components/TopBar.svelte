<script lang="ts" strictEvents>
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import UserAccountBox from "$lib/components/UserAccountBox.svelte";

  const {
    route: { id: routeId },
  } = $page;
</script>

<div class="wrapper">
  <UserAccountBox />
  <a
    class:active-tab={routeId === "/" || routeId === "/lessons"}
    href="{base}/lessons"
  >
    Lekce
  </a>
  <a class:active-tab={routeId === "/competences"} href="{base}/competences">
    Body
  </a>
  <a class:active-tab={routeId === "/images"} href="{base}/images">Obrázky</a>
  <!-- TODO
  <a class:active-tab={routeId === "/users"} href="{base}/users">Uživatelé</a>
  <a
    class="groups"
    class:active-tab={routeId === "/groups"}
    href="{base}/groups"
  >
    Uživatelské skupiny
  </a>
  -->
</div>

<style>
  a {
    border-left: 1px solid var(--border-color);
    border-right: 1px solid var(--border-color);
    color: var(--background);
    cursor: pointer;
    display: inline-block;
    font: inherit;
    font-size: 1.1em;
    font-weight: bold;
    height: 52px;
    margin-left: -5px;
    padding: 26px 0 2px 0;
    text-align: center;
    text-decoration: none;
    transition:
      color ease 0.15s,
      border-color ease 0.15s,
      background-color ease 0.15s;
    vertical-align: top;
    width: 140px;
  }

  .active-tab,
  a:hover {
    background-color: var(--background-darkest);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  /*
  .groups {
    padding-bottom: 12px;
    padding-top: 16px;
  }
  */

  .wrapper {
    background-color: var(--background-darker);
    border-bottom: 1px solid var(--border-color);
    height: 80px;
  }
</style>
