/* exported RequestResponse */

type RequestResponse =
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
