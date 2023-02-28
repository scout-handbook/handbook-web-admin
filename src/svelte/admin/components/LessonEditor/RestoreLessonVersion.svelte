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
  import RadioGroup from "../forms/RadioGroup.svelte";
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

  $: markdownPromise =
    selectedVersion === null
      ? new Promise<string>((resolve) => {
          resolve(body);
        })
      : request<string>(
          $apiUri +
            "/v1.0/lesson/" +
            lessonId! +
            "/history/" +
            selectedVersion.toString(),
          "GET",
          {},
          authFailHandler
        );

  function saveCallback(markdown: string): void {
    lessonName = selectedVersionName;
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
      {#await markdownPromise then markdown}
        <Button
          green
          icon="history"
          on:click={() => {
            saveCallback(markdown);
          }}
        >
          Obnovit
        </Button>
      {/await}
    {/if}
    <h1>Historie lekce</h1>
    <div id="lessonHistoryForm">
      {#if versionList === null}
        <LoadingIndicator />
      {:else}
        <form>
          <RadioGroup
            options={versionList.map((version) => [
              version.version,
              version.name,
            ])}
            bind:selected={selectedVersion}
          >
            <span slot="nullOption">
              <span class="lesson-history-current">Současná verze</span>
              —
              <LessonProvider silent let:lessons>
                <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
                {parseVersion(get(lessons, lessonId)?.version ?? 0)}
              </LessonProvider>
            </span>
            <span slot="option" let:id={version} let:value={name}>
              <span class="lesson-history-version">
                {name}
              </span>
              —
              <!-- eslint-disable-next-line @typescript-eslint/no-unsafe-argument -->
              {parseVersion(version)}
            </span>
          </RadioGroup>
        </form>
      {/if}
    </div>
  </div>
  <div id="lesson-history-preview">
    {#await markdownPromise.then(compileMarkdown)}
      <LoadingIndicator />
    {:then content}
      <h1>{selectedVersionName}</h1>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html content}
    {/await}
  </div>
</DoubleSidePanel>
