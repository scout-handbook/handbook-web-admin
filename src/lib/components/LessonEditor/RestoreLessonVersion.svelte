<script lang="ts">
  import type { LessonVersion } from "$lib/interfaces/LessonVersion";

  import Button from "$lib/components/Button.svelte";
  import DoubleSidePanel from "$lib/components/DoubleSidePanel.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import { apiUri } from "$lib/config";
  import { lessons } from "$lib/resources/lessons.svelte";
  import { compileMarkdown } from "$lib/utils/compileMarkdown";
  import { parseVersion } from "$lib/utils/parseVersion";
  import { authFailHandler, request } from "$lib/utils/request";
  import { SvelteMap } from "svelte/reactivity";

  interface Props {
    body: string;
    lessonId: string;
    lessonName: string;
  }

  let {
    body = $bindable(),
    lessonId,
    lessonName = $bindable(),
  }: Props = $props();

  let currentLessonVersion = $derived(lessons.current?.get(lessonId)?.version);
  let versionList = $state<Array<LessonVersion> | null>(null);
  let selectedVersion = $state<number | null>(null);
  let selectedVersionName = $derived(
    selectedVersion === null || versionList === null
      ? lessonName
      : (versionList.find((x) => x.version === selectedVersion)?.name ?? ""),
  );

  void request<Array<LessonVersion>>(
    `${apiUri}/v1.0/lesson/${lessonId}/history`,
    "GET",
    {},
    {},
  ).then((response) => {
    versionList = response;
  });

  let markdownPromise = $derived(
    selectedVersion === null
      ? new Promise<string>((resolve) => {
          resolve(body);
        })
      : request<string>(
          `${apiUri}/v1.0/lesson/${lessonId}/history/${selectedVersion.toString()}`,
          "GET",
          {},
          authFailHandler,
        ),
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
      onclick={(): void => {
        history.back();
      }}
      yellow
    >
      Zrušit
    </Button>
    {#if selectedVersion !== null}
      {#await markdownPromise then markdown}
        <Button
          green
          icon="history"
          onclick={(): void => {
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
          options={new SvelteMap(
            versionList.map((version) => [version.version, version.name]),
          )}
          bind:selected={selectedVersion}
        >
          {#snippet nullOption()}
            <span class="current-version">Současná verze</span>
            —
            {#if currentLessonVersion !== undefined}
              {parseVersion(currentLessonVersion)}
            {/if}
          {/snippet}
          {#snippet option(version: number, name: string)}
            <span>
              {name}
            </span>
            —
            {parseVersion(version)}
          {/snippet}
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

  span {
    font-weight: bold;
  }
</style>
