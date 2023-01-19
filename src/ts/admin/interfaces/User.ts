import type { Role } from "./Role";

export interface User {
  id: number;
  name: string;
  role: Role;
  groups: Array<string>;
}
