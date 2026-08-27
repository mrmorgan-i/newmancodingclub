import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  isAllowedAccountEmail,
  isNewmanEmail,
  normalizeEmail,
} from '../src/lib/auth/emailPolicy';

describe('account email policy', () => {
  it('normalizes email casing and whitespace', () => {
    assert.equal(normalizeEmail('  Student@NewmanU.edu '), 'student@newmanu.edu');
  });

  it('allows Newman accounts and the exact club owner exception', () => {
    assert.equal(isAllowedAccountEmail('student@newmanu.edu'), true);
    assert.equal(isAllowedAccountEmail('NEWMANCODINGCLUB@GMAIL.COM'), true);
  });

  it('does not allow lookalike domains or other personal accounts', () => {
    assert.equal(isNewmanEmail('student@newmanu.edu.example.com'), false);
    assert.equal(isAllowedAccountEmail('someone@gmail.com'), false);
  });
});
