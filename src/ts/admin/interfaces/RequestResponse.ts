import { Competence } from "./Competence";
import { DeletedLesson } from "./DeletedLesson";
import { Field } from "./Field";
import { Group } from "./Group";
import { Lesson } from "./Lesson";
import { LessonVersion } from "./LessonVersion";
import { Loginstate } from "./Loginstate";
import { Participant } from "./Participant";
import { UserListResponse } from "./UserListResponse";

export type RequestResponse =
  | string
  | Loginstate
  | UserListResponse
  | Record<string, Competence>
  | Record<string, DeletedLesson>
  | Record<string, Field>
  | Record<string, Group>
  | Record<string, Lesson>
  | Array<string>
  | Array<LessonVersion>
  | Array<Participant>;
