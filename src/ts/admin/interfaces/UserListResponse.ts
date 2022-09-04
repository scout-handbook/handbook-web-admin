import { User } from "./User";

export interface UserListResponse {
  count: number;
  users: Array<User>;
}
