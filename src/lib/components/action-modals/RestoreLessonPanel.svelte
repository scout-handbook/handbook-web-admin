<script lang="ts">
  import type { DeletedLesson } from "$lib/interfaces/DeletedLesson";
  import type { LessonVersion } from "$lib/interfaces/LessonVersion";

  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Button from "$lib/components/Button.svelte";
  import Dialog from "$lib/components/Dialog.svelte";
  import DoubleSidePanel from "$lib/components/DoubleSidePanel.svelte";
  import RadioGroup from "$lib/components/forms/RadioGroup.svelte";
  import LoadingIndicator from "$lib/components/LoadingIndicator.svelte";
  import Overlay from "$lib/components/Overlay.svelte";
  import SidePanel from "$lib/components/SidePanel.svelte";
  import { compileMarkdown } from "$lib/utils/compileMarkdown";
  import { parseVersion } from "$lib/utils/parseVersion";
  import { authFailHandler, reAuth, request } from "$lib/utils/request";
  import { SvelteMap } from "svelte/reactivity";

  let error = $state("");
  let step = $state("lesson-selection-loading");
  let lessonList: SvelteMap<string, DeletedLesson> = $state(new SvelteMap());
  let selectedLesson = $state("");
  let versionList: Array<LessonVersion> = $state([]);
  let selectedVersion = $state<number | null>(null);

  let name = $derived(
    selectedVersion === null
      ? ""
      : (versionList.find((x) => x.version === selectedVersion)?.name ?? ""),
  );
  let contentPromise = $derived(
    selectedVersion === null
      ? new Promise((resolve) => {
          resolve("");
        })
      : request<string>(
          `${CONFIG["api-uri"]}/v1.0/deleted-lesson/${selectedLesson}/history/${selectedVersion.toString()}`,
          "GET",
          {},
          authFailHandler,
        ).then(compileMarkdown),
  );

  void request<Record<string, DeletedLesson>>(
    `${CONFIG["api-uri"]}/v1.0/deleted-lesson`,
    "GET",
    {},
    {
      AuthenticationException: reAuth,
    },
  ).then((response) => {
    lessonList = new SvelteMap(Object.entries(response));
    if (lessonList.size === 0) {
      error = "Nejsou žádné smazané lekce.";
    }
    step = "lesson-selection";
  });

  function loadVersionList(): void {
    if (!selectedLesson) {
      return;
    }
    step = "version-selection-loading";
    void request<Array<LessonVersion>>(
      `${CONFIG["api-uri"]}/v1.0/deleted-lesson/${selectedLesson}/history`,
      "GET",
      {},
      {
        AuthenticationException: reAuth,
      },
    ).then((response) => {
      versionList = response;
      step = "version-selection";
    });
  }

  function selectVersionCallback(): void {
    if (selectedVersion !== null) {
      void goto(
        `${base}/lessons/${selectedLesson}/versions/${selectedVersion.toString()}/restore?name=${name}`,
      );
    }
  }
</script>

{#if error !== ""}
  <Dialog
    confirmButtonText="OK"
    onconfirm={(): void => {
      history.back();
    }}
  >
    {error}
  </Dialog>
{:else if step === "lesson-selection-loading" || step === "lesson-selection"}
  <SidePanel>
    <Button
      icon="cancel"
      onclick={(): void => {
        history.back();
      }}
      yellow>Zrušit</Button
    >
    <Button
      green
      icon="fast-fw"
      onclick={(): void => {
        if (step === "lesson-selection") {
          loadVersionList();
        }
      }}
    >
      Pokračovat
    </Button>
    <h1>Obnovit smazanou lekci</h1>
    {#if step === "lesson-selection-loading"}
      <LoadingIndicator />
    {:else if step === "lesson-selection"}
      <form>
        <RadioGroup options={lessonList} bind:selected={selectedLesson}>
          {#snippet option(_, lesson: DeletedLesson)}
            {lesson.name}
          {/snippet}
        </RadioGroup>
      </form>
    {/if}
  </SidePanel>
{:else if step === "version-selection-loading" || step === "version-selection"}
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
        <Button green icon="history" onclick={selectVersionCallback}
          >Obnovit</Button
        >
      {/if}
      <h1>Obnovit smazanou lekci</h1>
      {#if step === "version-selection-loading"}
        <LoadingIndicator />
      {:else if step === "version-selection"}
        <form>
          <RadioGroup
            options={new SvelteMap(
              versionList.map((version) => [version.version, version.name]),
            )}
            bind:selected={selectedVersion}
          >
            {#snippet option(version: number, versionName: string)}
              <span class="version-name">
                {versionName}
              </span>
              —
              {parseVersion(version)}
            {/snippet}
          </RadioGroup>
        </form>
      {/if}
    </div>
    <div class="preview">
      {#await contentPromise}
        <LoadingIndicator />
      {:then content}
        <h1>{name}</h1>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html content}
      {/await}
    </div>
  </DoubleSidePanel>
{/if}

<style>
  .preview {
    border-left: 1px solid var(--border-color);
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
