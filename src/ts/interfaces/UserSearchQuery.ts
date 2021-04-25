/* exported UserSearchQuery */

interface UserSearchQuery {
  name: string;
  page: number;
  "per-page": number;
  role?: Role;
  group?: string;
}
