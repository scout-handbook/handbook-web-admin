<script lang="ts" strictEvents>
  import type { LessonVersion } from "$lib/interfaces/LessonVersion";

  import Button from "$lib/components/Button.svelte";
  import DoubleSidePanel from "$lib/components/DoubleSidePanel.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import LessonProvider from "$lib/components/swr-wrappers/LessonProvider.svelte";
  import { apiUri } from "$lib/stores";
  import { get } from "$lib/utils/arrayUtils";
  import { compileMarkdown } from "$lib/utils/compileMarkdown";
  import { parseVersion } from "$lib/utils/parseVersion";
  import { authFailHandler, request } from "$lib/utils/request";

  export let lessonId: string;
  export let lessonName: string;
  export let body: string;

  let selectedVersion: number | null = null;
  let versionList: Array<LessonVersion> | null = null;
  $: selectedVersionName =
    selectedVersion === null || versionList === null
      ? lessonName
      : (versionList.find((x) => x.version === selectedVersion)?.name ?? "");

  void request<Array<LessonVersion>>(
    `${$apiUri}/v1.0/lesson/${lessonId}/history`,
    "GET",
    {},
    {},
  ).then((response) => {
    versionList = response;
  });

  $: markdownPromise =
    selectedVersion === null
      ? new Promise<string>((resolve) => {
          resolve(body);
        })
      : request<string>(
          `${$apiUri}/v1.0/lesson/${lessonId}/history/${selectedVersion.toString()}`,
          "GET",
          {},
          authFailHandler,
        );

  function saveCallback(markdown: string): void {
    lessonName = selectedVersionName;
    body = markdown;
    history.back();
  }
</script>

<Overlay />
<DoubleSidePanel>
  <div class="version-list">
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        history.back();
      }}
    >
      Zrušit
    </Button>
    {#if selectedVersion !== null}
      {#await markdownPromise then markdown}
        <Button
          green
          icon="history"
          on:click={() => {
            saveCallback(markdown);
          }}
        >
          Obnovit
        </Button>
      {/await}
    {/if}
    <h1>Historie lekce</h1>
    {#if versionList === null}
      <LoadingIndicator />
    {:else}
      <form>
        <RadioGroup
          options={versionList.map((version) => [
            version.version,
            version.name,
          ])}
          bind:selected={selectedVersion}
        >
          <span slot="null-option">
            <span class="current-version version-name">Současná verze</span>
            —
            <LessonProvider silent let:lessons>
              <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
              {parseVersion(get(lessons, lessonId)?.version ?? 0)}
            </LessonProvider>
          </span>
          <span slot="option" let:id={version} let:value={name}>
            <span class="version-name">
              {name}
            </span>
            —
            {parseVersion(version)}
          </span>
        </RadioGroup>
      </form>
    {/if}
  </div>
  <div class="preview">
    {#await markdownPromise.then(compileMarkdown)}
      <LoadingIndicator />
    {:then content}
      <h1>{selectedVersionName}</h1>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html content}
    {/await}
  </div>
</DoubleSidePanel>

<style>
  .current-version {
    font-style: italic;
  }

  .preview {
    border-left: solid 1px var(--border-color);
    bottom: 0;
    left: 430px;
    overflow-y: auto;
    padding: 0 20px 20px;
    position: absolute;
    top: 0;
    width: 528px;
  }

  .version-list {
    bottom: 0;
    overflow-y: auto;
    padding-bottom: 30px;
    padding-top: 30px;
    position: absolute;
    top: 0;
    width: 400px;
  }

  .version-name {
    font-weight: bold;
  }
</style>
