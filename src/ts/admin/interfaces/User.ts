import type { Role } from "./Role";

export interface User {
  groups: Array<string>;
  id: number;
  name: string;
  role: Role;
}
