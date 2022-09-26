<script lang="ts">
  import { config, loginstate } from "../../../ts/admin/stores";
</script>

<div id="top-bar">
  <div id="user-account">
    <img
      id="user-avatar"
      alt="Account avatar"
      src="{$config['admin-uri']}/avatar.png"
    />
    <div id="user-name">&nbsp;</div>
    <div id="log-link">
      <a
        href={$config[
          'admin-uri'
        ] + "/v1.0/logout?redirect-uri=" + encodeURIComponent(
          $config['frontend-uri']
        )}
      >
        Odhlásit
      </a>
      <a id="frontend-link" href="/">Zpět na web</a>
    </div>
  </div>
  <div id="lesson-manager" class="top-bar-tab">Lekce</div>
  <div id="competence-manager" class="top-bar-tab">Kompetence</div>
  <div id="image-manager" class="top-bar-tab">Obrázky</div>
  <div id="user-manager" class="top-bar-tab">Uživatelé</div>
  <div id="group-manager" class="top-bar-tab">Uživatelské skupiny</div>
</div>
