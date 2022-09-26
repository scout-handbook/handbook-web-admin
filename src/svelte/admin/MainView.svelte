<script lang="ts">
  import { onMount } from "svelte";

  import TopBar from "./components/TopBar.svelte";
  import { config } from "../../ts/admin/stores";
  import {
    mainPageTab,
    setMainPageTab,
    showMainView,
  } from "../../ts/admin/views/main";

  import { MainPageTab } from "../../ts/admin/interfaces/MainPageTab";

  if (window.location.pathname.substring(7)) {
    setMainPageTab(window.location.pathname.substring(7) as MainPageTab);
  }
  // TODO: Do directly
  onMount(() => {
    showMainView(false);
  });
</script>
