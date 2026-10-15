import type { Role } from "#lib/interfaces/Role.js";

export interface Loginstate {
  avatar: string;
  name: string;
  role: Role;
}
