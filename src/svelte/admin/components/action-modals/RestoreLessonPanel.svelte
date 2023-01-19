<script lang="ts">
  import { useNavigate } from "svelte-navigator";

  import { IDList } from "../../../../ts/admin/IDList";
  import type { DeletedLesson } from "../../../../ts/admin/interfaces/DeletedLesson";
  import type { LessonVersion } from "../../../../ts/admin/interfaces/LessonVersion";
  import type { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";
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
  let lessonList: IDList<DeletedLesson>;
  let selectedLesson = "";
  let versionList: Array<LessonVersion> = [];
  let selectedVersion: number | null = null;

  $: name =
    selectedVersion === null
      ? ""
      : versionList.find((x) => x.version === selectedVersion)!.name;
  $: contentPromise = new Promise<string>((resolve) => {
    if (selectedVersion === null) {
      resolve("");
      return;
    }
    request(
      $apiUri +
        "/v1.0/deleted-lesson/" +
        selectedLesson +
        "/history/" +
        selectedVersion.toString(),
      "GET",
      {},
      (response: RequestResponse) => {
        void compileMarkdown(response as string).then(resolve);
      },
      authFailHandler
    );
  });

  refreshLogin();

  request(
    $apiUri + "/v1.0/deleted-lesson",
    "GET",
    {},
    (response: RequestResponse) => {
      lessonList = new IDList(response as Record<string, DeletedLesson>);
      if (lessonList.empty()) {
        error = "Nejsou žádné smazané lekce.";
      }
      step = "lesson-selection";
    },
    reAuthHandler
  );

  function loadVersionList() {
    if (!selectedLesson) {
      return;
    }
    step = "version-selection-loading";
    request(
      $apiUri + "/v1.0/deleted-lesson/" + selectedLesson + "/history",
      "GET",
      {},
      (response: RequestResponse) => {
        versionList = response as Array<LessonVersion>;
        step = "version-selection";
      },
      reAuthHandler
    );
  }

  function selectVersionCallback() {
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
    <h3 class="side-panel-title">Obnovit smazanou lekci</h3>
    <div id="restoreLessonList">
      {#if step === "lesson-selection-loading"}
        <LoadingIndicator />
      {:else if step === "lesson-selection"}
        <form id="side-panel-form">
          {#each lessonList.asArray() as { id, value: lesson }}
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
    <div id="restore-lesson-version-list">
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
      <h3 class="side-panel-title">Obnovit smazanou lekci</h3>
      {#if step === "version-selection-loading"}
        <LoadingIndicator />
      {:else if step === "version-selection"}
        <form id="side-panel-form">
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
              <span class="restore-lesson-version">
                {version.name}
              </span>
              —
              {parseVersion(version.version)}
            </div>
          {/each}
        </form>
      {/if}
    </div>
    <div id="restore-lesson-preview">
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
