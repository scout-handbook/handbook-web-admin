<script lang="ts" strictEvents>
  import { useSWR } from "sswr";
  import { derived } from "svelte/store";
  import { useNavigate } from "svelte-navigator";

  import type { Competence } from "../../../../ts/admin/interfaces/Competence";
  import type { Lesson } from "../../../../ts/admin/interfaces/Lesson";
  import type { LessonVersion } from "../../../../ts/admin/interfaces/LessonVersion";
  import { apiUri } from "../../../../ts/admin/stores";
  import { processCompetences, processLessons } from "../../../../ts/admin/swr";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { compileMarkdown } from "../../../../ts/admin/tools/compileMarkdown";
  import { constructURL } from "../../../../ts/admin/tools/constructURL";
  import { parseVersion } from "../../../../ts/admin/tools/parseVersion";
  import { authFailHandler, request } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import DoubleSidePanel from "../DoubleSidePanel.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let lessonId: string | null;
  export let lessonName: string | null;
  export let body: string;

  const navigate = useNavigate();

  const competences = derived(
    useSWR<Record<string, Competence>>(constructURL("v1.0/competence")).data,
    processCompetences,
    undefined
  );
  const lessons = derived(
    [
      useSWR<Record<string, Lesson>>(
        constructURL("v1.0/lesson?override-group=true")
      ).data,
      competences,
    ],
    processLessons,
    undefined
  );
  let selectedVersion: number | null = null;
  let versionList: Array<LessonVersion> | null = null;
  $: currentVersion =
    $lessons !== undefined ? get($lessons, lessonId!)?.version : undefined;
  $: selectedVersionName =
    selectedVersion === null || versionList === null
      ? lessonName!
      : versionList.find((x) => x.version === selectedVersion)!.name;

  const historyPromise = request<Array<LessonVersion>>(
    $apiUri + "/v1.0/lesson/" + lessonId! + "/history",
    "GET",
    {},
    authFailHandler
  ).then((response) => {
    versionList = response;
    return versionList;
  });

  $: contentPromise =
    selectedVersion === null
      ? compileMarkdown(body)
      : request<string>(
          $apiUri +
            "/v1.0/lesson/" +
            lessonId! +
            "/history/" +
            selectedVersion.toString(),
          "GET",
          {},
          authFailHandler
        ).then(compileMarkdown);

  function saveCallback(markdown: string): void {
    (document.getElementById("name") as HTMLInputElement).value =
      selectedVersionName;
    body = markdown;
    navigate(-1);
  }
</script>

<DoubleSidePanel>
  <div id="lesson-history-list">
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
      {#await contentPromise then content}
        <Button
          green
          icon="history"
          on:click={() => {
            saveCallback(content);
          }}
        >
          Obnovit
        </Button>
      {/await}
    {/if}
    <h3 class="side-panel-title">Historie lekce</h3>
    <div id="lessonHistoryForm">
      {#await historyPromise}
        <LoadingIndicator />
      {:then versionList}
        <form id="side-panel-form">
          <div class="form-row">
            <label class="form-switch">
              <input
                name="version"
                type="radio"
                value={null}
                bind:group={selectedVersion}
              />
              <span class="form-custom form-radio" />
            </label>
            <span class="lesson-history-current">Současná verze</span>
            —
            {#if currentVersion !== undefined}
              {parseVersion(currentVersion)}
            {/if}
          </div>
          {#each versionList as version}
            <div class="form-row">
              <label class="form-switch">
                <input
                  name="version"
                  type="radio"
                  value={version.version}
                  bind:group={selectedVersion}
                />
                <span class="form-custom form-radio" />
              </label>
              <span class="lesson-history-version">
                {version.name}
              </span>
              —
              {parseVersion(version.version)}
            </div>
          {/each}
        </form>
      {/await}
    </div>
  </div>
  <div id="lesson-history-preview">
    {#await contentPromise}
      <LoadingIndicator />
    {:then content}
      <h1>{selectedVersionName}</h1>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html content}
    {/await}
  </div>
</DoubleSidePanel>
