import type { Competence } from "$lib/interfaces/Competence";
import type { DeletedLesson } from "$lib/interfaces/DeletedLesson";
import type { Field } from "$lib/interfaces/Field";
import type { Group } from "$lib/interfaces/Group";
import type { Lesson } from "$lib/interfaces/Lesson";
import type { LessonVersion } from "$lib/interfaces/LessonVersion";
import type { Loginstate } from "$lib/interfaces/Loginstate";
import type { Participant } from "$lib/interfaces/Participant";
import type { UserListResponse } from "$lib/interfaces/UserListResponse";

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
