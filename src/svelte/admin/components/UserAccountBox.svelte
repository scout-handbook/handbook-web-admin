<script lang="ts">
  import { adminUri, frontendUri, loginstate } from "../../../ts/admin/stores";

  $: avatar = $loginstate
    ? "data:image/png;base64," + $loginstate.avatar
    : $adminUri + "/avatar.png";
  $: name = $loginstate?.name;
</script>

<div id="user-account">
  <img id="user-avatar" alt="Account avatar" src={avatar} />
  <div id="user-name">
    {#if name}
      {name}
    {:else}
      &nbsp;
    {/if}
  </div>
  <div id="log-link">
    <a
      href={$adminUri +
        "/v1.0/logout?redirect-uri=" +
        encodeURIComponent($frontendUri)}
    >
      Odhlásit
    </a>
    <a id="frontend-link" href="/">Zpět na web</a>
  </div>
</div>
