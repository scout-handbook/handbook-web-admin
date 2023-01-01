<script lang="ts">
  import { Converter } from "showdown";
  import { filterXSS } from "xss";
  import { useNavigate } from "svelte-navigator";

  //import { ActionQueue } from "../../../../ts/admin/tools/ActionQueue";
  import { apiUri, lessons } from "../../../../ts/admin/stores";
  import { authFailHandler, request } from "../../../../ts/admin/tools/request";
  import Button from "../Button.svelte";
  import DoubleSidePanel from "../DoubleSidePanel.svelte";
  import { editor, setChanged } from "../../../../ts/admin/lessonEditor/editor";
  import { LessonVersion } from "../../../../ts/admin/interfaces/LessonVersion";
  import LoadingIndicator from "../LoadingIndicator.svelte";
  import { parseVersion } from "../../../../ts/admin/tools/parseVersion";
  import { refreshLogin } from "../../../../ts/admin/tools/refreshLogin";
  import { RequestResponse } from "../../../../ts/admin/interfaces/RequestResponse";
  import { xssOptions } from "../../../../ts/common/xssOptions";

  export let lessonId: string | null;
  export let lessonName: string | null;

  const navigate = useNavigate();

  let selectedVersion: number | null = null;
  let versionList: Array<LessonVersion> | null = null;
  $: currentVersion = $lessons?.get(lessonId!)?.version ?? 0;
  $: name =
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
      resolve(editor.value());
    } else {
      request(
        $apiUri + "/v1.0/lesson/" + lessonId! + "/history/" + selectedVersion,
        "GET",
        {},
        (response: RequestResponse): void => {
          resolve(response as string);
        },
        authFailHandler
      );
    }
  });

  function process(markdown: string): string {
    let converter = new Converter({
      extensions: ["HandbookMarkdown"],
    });
    converter.setOption("noHeaderId", "true");
    converter.setOption("tables", "true");
    converter.setOption("smoothLivePreview", "true");
    return filterXSS(converter.makeHtml(markdown), xssOptions());
  }

  function saveCallback(markdown: string) {
    (document.getElementById("name") as HTMLInputElement).value = name;
    editor.value(markdown);
    setChanged();
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
      <h1>{name}</h1>
      {@html process(content)}
    {/await}
  </div>
</DoubleSidePanel>
