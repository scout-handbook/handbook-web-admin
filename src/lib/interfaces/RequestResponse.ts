import type { Competence } from "#lib/interfaces/Competence.js";
import type { DeletedLesson } from "#lib/interfaces/DeletedLesson.js";
import type { Field } from "#lib/interfaces/Field.js";
import type { Group } from "#lib/interfaces/Group.js";
import type { Lesson } from "#lib/interfaces/Lesson.js";
import type { LessonVersion } from "#lib/interfaces/LessonVersion.js";
import type { Loginstate } from "#lib/interfaces/Loginstate.js";
import type { Participant } from "#lib/interfaces/Participant.js";
import type { UserListResponse } from "#lib/interfaces/UserListResponse.js";

export type RequestResponse =
  | Array<LessonVersion>
  | Array<Participant>
  | Array<string>
  | Loginstate
  | Record<string, Competence>
  | Record<string, DeletedLesson>
  | Record<string, Field>
  | Record<string, Group>
  | Record<string, Lesson>
  | UserListResponse
  | string;
