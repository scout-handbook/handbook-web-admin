<div id="top-bar">
	<div id="user-account">
		<img id="user-avatar" alt="Account avatar" src="{$admin_uri}/avatar.png">
		<div id="user-name">&nbsp;</div>
		<div id="log-link">
			<a href="{$admin_uri}/v1.0/logout?redirect-uri={encodeURIComponent($frontend_uri)}">Odhlásit</a>
			<a href="/" id="frontend-link">Zpět na web</a>
		</div>
	</div>
	<div class="top-bar-tab" id="lesson-manager">Lekce</div>
	<div class="top-bar-tab" id="competence-manager">Kompetence</div>
	<div class="top-bar-tab" id="image-manager">Obrázky</div>
	<div class="top-bar-tab" id="user-manager">Uživatelé</div>
	<div class="top-bar-tab" id="group-manager">Uživatelské skupiny</div>
</div>

<script lang="ts">
	import { admin_uri, frontend_uri } from "../../ts/admin/stores";
</script>
