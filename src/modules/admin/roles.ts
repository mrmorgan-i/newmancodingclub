export const ADMIN_ROLES = {
  OWNER: 'owner',
  EDITOR: 'editor',
} as const;

export type AdminRole = (typeof ADMIN_ROLES)[keyof typeof ADMIN_ROLES];

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  owner: 'Owner',
  editor: 'Editor',
};

export function isAdminRole(value: unknown): value is AdminRole {
  return value === ADMIN_ROLES.OWNER || value === ADMIN_ROLES.EDITOR;
}
