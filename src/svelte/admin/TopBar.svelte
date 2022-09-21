<div id="top-bar">
	<div id="user-account">
		<img id="user-avatar" alt="Account avatar" src="{CONFIG['admin-uri']}/avatar.png">
		<div id="user-name">&nbsp;</div>
		<div id="log-link">
			<a href="{CONFIG['api-uri']}/v1.0/logout?redirect-uri={encodeURIComponent(CONFIG['frontend-uri'])}">Odhlásit</a>
			<a href="/" id="frontend-link">Zpět na web</a>
		</div>
	</div>
	<div class="top-bar-tab" id="lesson-manager">Lekce</div>
	<div class="top-bar-tab" id="competence-manager">Kompetence</div>
	<div class="top-bar-tab" id="image-manager">Obrázky</div>
	<div class="top-bar-tab" id="user-manager">Uživatelé</div>
	<div class="top-bar-tab" id="group-manager">Uživatelské skupiny</div>
</div>
