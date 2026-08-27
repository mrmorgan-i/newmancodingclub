import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  normalizePhoneNumber,
  parseJoinSubmission,
} from '../src/modules/members/joinSubmission';

describe('join submission validation', () => {
  it('accepts and normalizes the phone format produced by the form', () => {
    assert.equal(normalizePhoneNumber('(316) 555-0123'), '3165550123');

    assert.deepEqual(
      parseJoinSubmission({
        name: '  Newman Student ',
        email: ' Student@NewmanU.edu ',
        phone: '(316) 555-0123',
        major: 'cs',
      }),
      {
        success: true,
        data: {
          name: 'Newman Student',
          email: 'student@newmanu.edu',
          phone: '3165550123',
          major: 'Computer Science',
        },
      },
    );
  });

  it('keeps the optional major optional', () => {
    const result = parseJoinSubmission({
      name: 'Newman Student',
      email: 'student@newmanu.edu',
      phone: '3165550123',
      major: '',
    });

    assert.equal(result.success, true);
    if (result.success) assert.equal(result.data.major, 'Not specified');
  });

  it('rejects malformed phone numbers and non-Newman addresses', () => {
    assert.equal(
      parseJoinSubmission({
        name: 'Student',
        email: 'student@gmail.com',
        phone: '3165550123',
      }).success,
      false,
    );
    assert.equal(
      parseJoinSubmission({
        name: 'Student',
        email: 'student@newmanu.edu',
        phone: '555-0123',
      }).success,
      false,
    );
  });
});
