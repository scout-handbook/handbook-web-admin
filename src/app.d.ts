import type { User } from "$lib/interfaces/User";

export type PageStateFix =
  | {
      action: "add-competence" | "add-field" | "add-image" | "restore-lesson";
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
      action: "change-user-groups" | "change-user-role";
      actionPayload: {
        user: User;
      };
    }
  | {
      action: "delete-image";
      actionPayload: {
        imageId: string;
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
