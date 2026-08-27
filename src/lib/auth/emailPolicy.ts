export const OWNER_ACCOUNT_EMAIL = 'newmancodingclub@gmail.com';
export const NEWMAN_EMAIL_DOMAIN = 'newmanu.edu';

export const ACCOUNT_EMAIL_REQUIREMENT =
  'Use your Newman University email address or the authorized club owner address.';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isNewmanEmail(email: string): boolean {
  return normalizeEmail(email).endsWith(`@${NEWMAN_EMAIL_DOMAIN}`);
}

export function isAllowedAccountEmail(email: string): boolean {
  const normalizedEmail = normalizeEmail(email);

  return (
    normalizedEmail === OWNER_ACCOUNT_EMAIL ||
    isNewmanEmail(normalizedEmail)
  );
}
