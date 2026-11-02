import { exampleSetup } from "prosemirror-example-setup";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
  schema,
} from "prosemirror-markdown";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export class ProseMirrorView {
  private readonly view: EditorView;

  public constructor(target: HTMLElement, content: string) {
    this.view = new EditorView(target, {
      state: EditorState.create({
        doc: defaultMarkdownParser.parse(content) ?? undefined,
        plugins: exampleSetup({ schema }), // TODO: Remove this eventually
      }),
    });
  }

  public content(): string {
    return defaultMarkdownSerializer.serialize(this.view.state.doc);
  }
  public focus(): void {
    this.view.focus();
  }
  public destroy(): void {
    this.view.destroy();
  }
}
