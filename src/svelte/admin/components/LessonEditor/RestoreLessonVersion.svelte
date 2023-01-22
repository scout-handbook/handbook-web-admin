<script lang="ts" strictEvents>
  import { useNavigate } from "svelte-navigator";

  import type { LessonVersion } from "../../../../ts/admin/interfaces/LessonVersion";
  import type { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";
  import { apiUri, lessons } from "../../../../ts/admin/stores";
  import { compileMarkdown } from "../../../../ts/admin/tools/compileMarkdown";
  import { parseVersion } from "../../../../ts/admin/tools/parseVersion";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import { authFailHandler, request } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import DoubleSidePanel from "../DoubleSidePanel.svelte";
  import LoadingIndicator from "../LoadingIndicator.svelte";

  export let lessonId: string | null;
  export let lessonName: string | null;
  export let body: string;

  const navigate = useNavigate();

  let selectedVersion: number | null = null;
  let versionList: Array<LessonVersion> | null = null;
  $: currentVersion = $lessons?.get(lessonId!)?.version ?? 0;
  $: selectedVersionName =
    selectedVersion === null || versionList === null
      ? lessonName!
      : versionList.find((x) => x.version === selectedVersion)!.name;

  const historyPromise = new Promise<Array<LessonVersion>>((resolve) => {
    request(
      $apiUri + "/v1.0/lesson/" + lessonId! + "/history",
      "GET",
      {},
      (response: RequestResponse): void => {
        versionList = response as Array<LessonVersion>;
        resolve(versionList);
      },
      authFailHandler
    );
  });

  $: contentPromise = new Promise<string>((resolve) => {
    refreshLogin();
    if (selectedVersion === null) {
      void compileMarkdown(body).then(resolve);
    } else {
      request(
        $apiUri +
          "/v1.0/lesson/" +
          lessonId! +
          "/history/" +
          selectedVersion.toString(),
        "GET",
        {},
        (response: RequestResponse): void => {
          void compileMarkdown(response as string).then(resolve);
        },
        authFailHandler
      );
    }
  });

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
            {parseVersion(currentVersion)}
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
