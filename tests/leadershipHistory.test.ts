import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  formatLeadershipTerm,
  groupPastLeadershipByYear,
} from '../src/modules/leadership/history';
import type { ILeadershipMember } from '../src/types';

function member(
  id: number,
  termStart: string | null,
  termEnd: string,
): ILeadershipMember {
  return {
    id,
    name: `Member ${id}`,
    role: 'Officer',
    bio: 'Bio',
    email: null,
    imageUrl: null,
    kind: 'officer',
    termStart,
    termEnd,
  };
}

describe('past leadership history', () => {
  it('groups ended terms by newest year while preserving query order', () => {
    const groups = groupPastLeadershipByYear([
      member(1, '2025-08-20', '2026-05-15'),
      member(2, '2025-08-20', '2026-05-15'),
      member(3, '2024-08-20', '2025-05-15'),
    ]);

    assert.deepEqual(groups.map((group) => group.year), ['2026', '2025']);
    assert.deepEqual(groups[0]?.members.map((entry) => entry.id), [1, 2]);
  });

  it('formats same-year, cross-year, and open-start terms', () => {
    assert.equal(formatLeadershipTerm('2026-08-27', '2026-12-03'), 'Aug–Dec 2026');
    assert.equal(formatLeadershipTerm('2025-08-20', '2026-05-15'), 'Aug 2025–May 2026');
    assert.equal(formatLeadershipTerm(null, '2026-05-15'), 'Through May 2026');
  });
});
