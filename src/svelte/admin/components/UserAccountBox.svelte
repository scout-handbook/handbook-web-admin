<script lang="ts" strictEvents>
  import { useSWR } from "sswr";

  import type { Loginstate } from "../../../ts/admin/interfaces/Loginstate";

  import { adminUri, apiUri, frontendUri } from "../../../ts/admin/stores";
  import { constructURL } from "../../../ts/admin/utils/constructURL";

  const { data: loginstate } = useSWR<Loginstate>(constructURL("v1.0/account"));
  $: avatar = $loginstate
    ? `data:image/png;base64,${$loginstate.avatar}`
    : `${$adminUri}/avatar.png`;
  $: name = $loginstate?.name;
</script>

<div class="container">
  <img alt="Account avatar" src={avatar} />
  <div class="name">
    {#if name}
      {name}
    {:else}
      &nbsp;
    {/if}
  </div>
  <div class="links">
    <a
      href={`${$apiUri}/v1.0/logout?redirect-uri=${encodeURIComponent($frontendUri)}`}
    >
      Odhlásit
    </a>
    <a class="frontend-link" href="/">Zpět na web</a>
  </div>
</div>

<style>
  a {
    color: var(--accent-color);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  .frontend-link {
    float: right;
    margin-right: 20px;
  }

  img {
    border: var(--avatar-border);
    border-radius: 50%;
    float: left;
    height: 60px;
    margin: 5px 15px;
    overflow: hidden;
    width: 60px;
  }

  .links {
    margin-top: 5px;
  }

  .name {
    padding-top: 12px;
  }

  .container {
    border-right: 1px solid var(--border-color);
    display: inline-block;
    height: 80px;
    width: var(--nav-width);
  }
</style>
