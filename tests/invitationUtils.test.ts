import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createInvitationToken,
  getInvitationExpiry,
  getInvitationStatus,
  hashInvitationToken,
  isValidInvitationToken,
  normalizeEmail,
} from '../src/modules/admin/invitationUtils';

describe('admin invitation security helpers', () => {
  it('normalizes invited email addresses', () => {
    assert.equal(normalizeEmail('  Secretary@NewmanU.edu '), 'secretary@newmanu.edu');
  });

  it('creates opaque tokens and stores deterministic hashes', () => {
    const token = createInvitationToken();

    assert.equal(isValidInvitationToken(token), true);
    assert.equal(token.length >= 40, true);
    assert.equal(hashInvitationToken(token), hashInvitationToken(token));
    assert.notEqual(hashInvitationToken(token), token);
  });

  it('expires invitations seven days after they are issued', () => {
    const issuedAt = new Date('2026-08-27T12:00:00.000Z');
    assert.equal(
      getInvitationExpiry(issuedAt).toISOString(),
      '2026-09-03T12:00:00.000Z',
    );
  });

  it('prioritizes accepted and revoked states over expiration', () => {
    const now = new Date('2026-09-05T12:00:00.000Z');
    const expiredAt = new Date('2026-09-01T12:00:00.000Z');

    assert.equal(
      getInvitationStatus(
        { acceptedAt: new Date(), revokedAt: null, expiresAt: expiredAt },
        now,
      ),
      'accepted',
    );
    assert.equal(
      getInvitationStatus(
        { acceptedAt: null, revokedAt: new Date(), expiresAt: expiredAt },
        now,
      ),
      'revoked',
    );
    assert.equal(
      getInvitationStatus(
        { acceptedAt: null, revokedAt: null, expiresAt: expiredAt },
        now,
      ),
      'expired',
    );
  });
});
