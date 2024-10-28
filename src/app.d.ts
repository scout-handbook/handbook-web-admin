import type { User } from "$lib/interfaces/User";

export type PageStateFix =
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
      action: "change-group" | "delete-group" | "import-group-members";
      actionPayload: {
        groupId: string;
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
    }
  | {
      action:
        | "add-competence"
        | "add-field"
        | "add-group"
        | "add-image"
        | "restore-lesson";
    }
  | {
      action:
        | "change-lesson-competences"
        | "change-lesson-field"
        | "change-lesson-groups"
        | "restore-version";
      view?: "lesson-settings";
    };
