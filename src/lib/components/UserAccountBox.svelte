<script lang="ts">
  import type { Loginstate } from "$lib/interfaces/Loginstate";

  import { adminUri, apiUri, frontendUri } from "$lib/config";
  import { createQuery } from "@tanstack/svelte-query";

  const accountQuery = createQuery<Loginstate>({
    queryKey: ["v1.0", "account"],
  });
  let avatar = $derived(
    $accountQuery.isSuccess
      ? `data:image/png;base64,${$accountQuery.data.avatar}`
      : `${adminUri}/avatar.png`,
  );
  let name = $derived($accountQuery.data?.name);
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
    <!-- eslint-disable svelte/no-navigation-without-base -- Absolute URLs -->
    <a
      href={`${apiUri}/v1.0/logout?redirect-uri=${encodeURIComponent(frontendUri)}`}
    >
      Odhlásit
    </a>
    <a class="frontend-link" href={frontendUri}>Zpět na web</a>
    <!-- eslint-enable -->
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
