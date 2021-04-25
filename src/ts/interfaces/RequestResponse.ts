/* exported RequestResponse */

type RequestResponse =
  | Loginstate
  | UserListResponse
  | Record<string, Competence>
  | Record<string, DeletedLesson>
  | Record<string, Field>
  | Record<string, Group>
  | Record<string, Lesson>;
