import type { Role } from "$lib/interfaces/Role";

export interface User {
  groups: Array<string>;
  id: number;
  name: string;
  role: Role;
}
