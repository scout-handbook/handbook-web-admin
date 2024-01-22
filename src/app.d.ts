export type PageStateFix =
  | {
      action: "add-field" | "restore-lesson";
    }
  | {
      action: "change-field" | "delete-field";
      actionPayload: {
        fieldId: string;
      };
    }
  | {
      action: "delete-lesson";
      actionPayload: {
        lessonId: string;
      };
    };

declare global {
  namespace App {
    export type PageState = PageStateFix;
  }
}
