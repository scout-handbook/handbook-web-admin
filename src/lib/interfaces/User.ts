import type { Role } from "#lib/interfaces/Role.js";

export interface User {
  groups: Array<string>;
  id: number;
  name: string;
  role: Role;
}
