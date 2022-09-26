<div id="side-panel"></div>
<div id="side-panel-overlay"></div>
<TopBar />
<div id="main-page-container">
	<div id="main-page">
		<h1>
			{$config["site-name"]} - 
			{#if mainPageTab === "competences"}
				Kompetence
			{:else if mainPageTab === "images"}
				Obrázky
			{:else if mainPageTab === "users"}
				Uživatelé
			{:else if mainPageTab === "groups"}
				Uživatelské skupiny
			{:else}
				Lekce
			{/if}
		</h1>
		<div id="embedded-spinner"></div>
	</div>
</div>

<script lang="ts">
import TopBar from "./components/TopBar.svelte";
import { config } from "../../ts/admin/stores";
import { mainPageTab, setMainPageTab, showMainView } from "../../ts/admin/views/main";

import { MainPageTab } from "../../ts/admin/interfaces/MainPageTab";

if (window.location.pathname.substring(7)) {
setMainPageTab(window.location.pathname.substring(7) as MainPageTab);
}
showMainView(false);
</script>
