import type { Role } from "$lib/interfaces/Role";

export interface User {
  id: number;
  name: string;
  role: Role;
  groups: Array<string>;
}
