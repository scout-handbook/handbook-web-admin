import type { User } from "$lib/interfaces/User";

export interface UserListResponse {
  count: number;
  users: Array<User>;
}
