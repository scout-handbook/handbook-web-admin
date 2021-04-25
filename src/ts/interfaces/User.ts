/* exported User */

interface User {
  id: number;
  name: string;
  role: Role;
  groups: Array<string>;
}
