export type PageStateFix =
  | {
      action: "add-competence" | "add-field" | "restore-lesson";
    }
  | {
      action: "change-competence" | "delete-competence";
      actionPayload: {
        competenceId: string;
      };
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
