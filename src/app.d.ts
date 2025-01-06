import type { Config } from "$lib/interfaces/Config";
import type { User } from "$lib/interfaces/User";

export type Action =
  | {
      competenceId: string;
      name: "change-competence" | "delete-competence";
    }
  | {
      fieldId: string;
      name: "change-field" | "delete-field";
    }
  | {
      groupId: string;
      name: "change-group" | "delete-group" | "import-group-members";
    }
  | {
      imageId: string;
      name: "delete-image";
    }
  | {
      lessonId: string;
      name: "delete-lesson";
    }
  | {
      name: "change-user-groups" | "change-user-role";
      user: User;
    }
  | {
      name:
        | "add-competence"
        | "add-field"
        | "add-group"
        | "add-image"
        | "restore-lesson";
    }
  | {
      name:
        | "change-lesson-competences"
        | "change-lesson-field"
        | "change-lesson-groups"
        | "restore-version"
        | null;
      view: "lesson-settings";
    };

declare global {
  const CONFIG: Config;
  namespace App {
    export interface PageState {
      action: Action;
    }
  }
}
