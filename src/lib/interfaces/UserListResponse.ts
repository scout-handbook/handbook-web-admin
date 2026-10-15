import type { User } from "#lib/interfaces/User.js";

export interface UserListResponse {
  count: number;
  users: Array<User>;
}
