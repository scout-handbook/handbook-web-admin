<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { LessonVersion } from "../../../../ts/admin/interfaces/LessonVersion";
  import { apiUri } from "../../../../ts/admin/stores";
  import { get } from "../../../../ts/admin/tools/arrayTools";
  import { compileMarkdown } from "../../../../ts/admin/tools/compileMarkdown";
  import { parseVersion } from "../../../../ts/admin/tools/parseVersion";
  import { authFailHandler, request } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import DoubleSidePanel from "../DoubleSidePanel.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import LessonProvider from "../swr-wrappers/LessonProvider.svelte";

  export let lessonId: string;
  export let lessonName: string | null;
  export let body: string;

  const navigate = useNavigate();

  let selectedVersion: number | null = null;
  let versionList: Array<LessonVersion> | null = null;
  $: selectedVersionName =
    selectedVersion === null || versionList === null
      ? lessonName!
      : versionList.find((x) => x.version === selectedVersion)!.name;

  void request<Array<LessonVersion>>(
    $apiUri + "/v1.0/lesson/" + lessonId! + "/history",
    "GET",
    {},
    {}
  ).then((response) => {
    versionList = response;
  });

  $: console.log(versionList);

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
      {#if versionList === null}
        <LoadingIndicator />
      {:else}
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
            <LessonProvider silent let:lessons>
              <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
              {parseVersion(get(lessons, lessonId)?.version ?? 0)}
            </LessonProvider>
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
      {/if}
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
