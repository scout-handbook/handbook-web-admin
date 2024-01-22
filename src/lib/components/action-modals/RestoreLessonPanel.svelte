<script lang="ts" strictEvents>
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
  import { apiUri } from "$lib/stores";
  import { compileMarkdown } from "$lib/utils/compileMarkdown";
  import { parseVersion } from "$lib/utils/parseVersion";
  import { authFailHandler, reAuth, request } from "$lib/utils/request";

  let error = "";
  let step = "lesson-selection-loading";
  let lessonList: Array<[string, DeletedLesson]>;
  let selectedLesson = "";
  let versionList: Array<LessonVersion> = [];
  let selectedVersion: number | null = null;

  $: name =
    selectedVersion === null
      ? ""
      : (versionList.find((x) => x.version === selectedVersion)?.name ?? "");
  $: contentPromise =
    selectedVersion === null
      ? new Promise((resolve) => {
          resolve("");
        })
      : request<string>(
          `${$apiUri}/v1.0/deleted-lesson/${selectedLesson}/history/${selectedVersion.toString()}`,
          "GET",
          {},
          authFailHandler,
        ).then(compileMarkdown);

  void request<Record<string, DeletedLesson>>(
    `${$apiUri}/v1.0/deleted-lesson`,
    "GET",
    {},
    {
      AuthenticationException: reAuth,
    },
  ).then((response) => {
    lessonList = Object.entries(response);
    if (lessonList.length === 0) {
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
      `${$apiUri}/v1.0/deleted-lesson/${selectedLesson}/history`,
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
    on:confirm={() => {
      history.back();
    }}
  >
    {error}
  </Dialog>
{:else if step === "lesson-selection-loading" || step === "lesson-selection"}
  <SidePanel>
    <Button
      icon="cancel"
      yellow
      on:click={() => {
        history.back();
      }}>Zrušit</Button
    >
    <Button
      green
      icon="fast-fw"
      on:click={() => {
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
          <span slot="option" let:value={lesson}>
            {lesson.name}
          </span>
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
        yellow
        on:click={() => {
          history.back();
        }}
      >
        Zrušit
      </Button>
      {#if selectedVersion !== null}
        <Button green icon="history" on:click={selectVersionCallback}
          >Obnovit</Button
        >
      {/if}
      <h1>Obnovit smazanou lekci</h1>
      {#if step === "version-selection-loading"}
        <LoadingIndicator />
      {:else if step === "version-selection"}
        <form>
          <RadioGroup
            options={versionList.map((version) => [
              version.version,
              version.name,
            ])}
            bind:selected={selectedVersion}
          >
            <span slot="option" let:id={version} let:value={versionName}>
              <span class="version-name">
                {versionName}
              </span>
              —
              {parseVersion(version)}
            </span>
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
