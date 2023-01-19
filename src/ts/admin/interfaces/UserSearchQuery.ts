import type { Role } from "./Role";

export interface UserSearchQuery {
  name: string;
  page: number;
  "per-page": number;
  role?: Role;
  group?: string;
}
