<script lang="ts">
  import { Converter } from "showdown";
  import { filterXSS } from "xss";
  import { useNavigate } from "svelte-navigator";

  import { apiUri } from "../../../../ts/admin/stores";
  import {
    authFailHandler,
    reAuthHandler,
    request,
  } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import { DeletedLesson } from "../../../../ts/admin/interfaces/DeletedLesson";
  import Dialog from "../Dialog.svelte";
  import DoubleSidePanel from "../DoubleSidePanel.svelte";
  import { IDList } from "../../../../ts/admin/IDList";
  import { LessonVersion } from "../../../../ts/admin/interfaces/LessonVersion";
  import { parseVersion } from "../../../../ts/admin/tools/parseVersion";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import Overlay from "../Overlay.svelte";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";
  import SidePanel from "../SidePanel.svelte";
  import { xssOptions } from "../../../../ts/common/xssOptions";
  import "../../../../ts/common/HandbookMarkdown";

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
  $: contentPromise =
    selectedVersion === null
      ? null
      : new Promise<string>((resolve) => {
          request(
            $apiUri +
              "/v1.0/deleted-lesson/" +
              selectedLesson +
              "/history/" +
              selectedVersion!.toString(),
            "GET",
            {},
            (response: RequestResponse) => {
              let converter = new Converter({
                extensions: ["HandbookMarkdown"],
              });
              converter.setOption("noHeaderId", "true");
              converter.setOption("tables", "true");
              converter.setOption("smoothLivePreview", "true");
              resolve(
                filterXSS(converter.makeHtml(response as string), xssOptions())
              );
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
        <Button
          green
          icon="history"
          on:click={() => {
            navigate(
              "/lessons/" +
                selectedLesson +
                "/versions/" +
                selectedVersion +
                "/restore?name=" +
                name
            );
          }}
        >
          Obnovit
        </Button>
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
      {#if contentPromise !== null}
        {#await contentPromise}
          <LoadingIndicator />
        {:then content}
          <h1>{name}</h1>
          {@html content}
        {/await}
      {/if}
    </div>
  </DoubleSidePanel>
{/if}
