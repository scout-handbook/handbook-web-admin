import type { Competence } from "./Competence";
import type { DeletedLesson } from "./DeletedLesson";
import type { Field } from "./Field";
import type { Group } from "./Group";
import type { Lesson } from "./Lesson";
import type { LessonVersion } from "./LessonVersion";
import type { Loginstate } from "./Loginstate";
import type { Participant } from "./Participant";
import type { UserListResponse } from "./UserListResponse";

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
