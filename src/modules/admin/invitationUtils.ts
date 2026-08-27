import { createHash, randomBytes } from 'node:crypto';

export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired';

export function createInvitationToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashInvitationToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getInvitationExpiry(now: Date = new Date()): Date {
  const expiresAt = new Date(now);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + 7);
  return expiresAt;
}

export function getInvitationStatus(invitation: {
  acceptedAt: Date | null;
  revokedAt: Date | null;
  expiresAt: Date;
}, now: Date = new Date()): InvitationStatus {
  if (invitation.acceptedAt) return 'accepted';
  if (invitation.revokedAt) return 'revoked';
  if (invitation.expiresAt <= now) return 'expired';
  return 'pending';
}

export function isValidInvitationToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{40,100}$/.test(token);
}
