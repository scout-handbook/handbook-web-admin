<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { DeletedLesson } from "../../../../ts/admin/interfaces/DeletedLesson";
  import type { LessonVersion } from "../../../../ts/admin/interfaces/LessonVersion";
  import { apiUri } from "../../../../ts/admin/stores";
  import { compileMarkdown } from "../../../../ts/admin/tools/compileMarkdown";
  import { parseVersion } from "../../../../ts/admin/tools/parseVersion";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import {
    authFailHandler,
    reAuthHandler,
    request,
  } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import Dialog from "../Dialog.svelte";
  import DoubleSidePanel from "../DoubleSidePanel.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";
  import SidePanel from "../SidePanel.svelte";

  const navigate = useNavigate();

  let error = "";
  let step = "lesson-selection-loading";
  let lessonList: Array<[string, DeletedLesson]>;
  let selectedLesson = "";
  let versionList: Array<LessonVersion> = [];
  let selectedVersion: number | null = null;

  $: name =
    selectedVersion === null
      ? ""
      : versionList.find((x) => x.version === selectedVersion)!.name;
  $: contentPromise =
    selectedVersion === null
      ? new Promise((resolve) => {
          resolve("");
        })
      : request<string>(
          $apiUri +
            "/v1.0/deleted-lesson/" +
            selectedLesson +
            "/history/" +
            selectedVersion.toString(),
          "GET",
          {},
          authFailHandler
        ).then(compileMarkdown);

  refreshLogin();

  void request<Record<string, DeletedLesson>>(
    $apiUri + "/v1.0/deleted-lesson",
    "GET",
    {},
    reAuthHandler
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
      $apiUri + "/v1.0/deleted-lesson/" + selectedLesson + "/history",
      "GET",
      {},
      reAuthHandler
    ).then((response) => {
      versionList = response;
      step = "version-selection";
    });
  }

  function selectVersionCallback(): void {
    navigate(
      "/lessons/" +
        selectedLesson +
        "/versions/" +
        selectedVersion!.toString() +
        "/restore?name=" +
        name
    );
  }
</script>

{#if error !== ""}
  <Dialog
    confirmButtonText="OK"
    on:confirm={() => {
      navigate(-1);
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
        navigate(-1);
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
    <div id="restoreLessonList">
      {#if step === "lesson-selection-loading"}
        <LoadingIndicator />
      {:else if step === "lesson-selection"}
        <form>
          {#each lessonList as [id, lesson]}
            <div class="form-row">
              <label class="form-switch">
                <input
                  name="lesson"
                  type="radio"
                  value={id}
                  bind:group={selectedLesson}
                />
                <span class="form-custom form-radio" />
              </label>
              {lesson.name}
            </div>
          {/each}
        </form>
      {/if}
    </div>
  </SidePanel>
{:else if step === "version-selection-loading" || step === "version-selection"}
  <Overlay />
  <DoubleSidePanel>
    <div class="version-list">
      <Button
        icon="cancel"
        yellow
        on:click={() => {
          navigate(-1);
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
          {#each versionList as version}
            <div class="form-row">
              <label class="form-switch">
                <input
                  name="restoreLessonversion"
                  type="radio"
                  value={version.version}
                  bind:group={selectedVersion}
                />
                <span class="form-custom form-radio" />
              </label>
              <span class="version-name">
                {version.name}
              </span>
              —
              {parseVersion(version.version)}
            </div>
          {/each}
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
