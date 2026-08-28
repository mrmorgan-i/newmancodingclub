import { formatDateOnly } from '@/lib/dateOnly';
import type { ILeadershipMember } from '@/types';

export interface LeadershipYearGroup {
  year: string;
  members: ILeadershipMember[];
}

export function groupPastLeadershipByYear(
  members: ILeadershipMember[],
): LeadershipYearGroup[] {
  const groups = new Map<string, ILeadershipMember[]>();

  for (const member of members) {
    if (!member.termEnd) continue;
    const year = member.termEnd.slice(0, 4);
    const group = groups.get(year) ?? [];
    group.push(member);
    groups.set(year, group);
  }

  return Array.from(groups, ([year, groupedMembers]) => ({
    year,
    members: groupedMembers,
  })).sort((left, right) => right.year.localeCompare(left.year));
}

export function formatLeadershipTerm(
  termStart: string | null,
  termEnd: string,
): string {
  const endMonth = formatDateOnly(termEnd, { month: 'short' });
  const endYear = formatDateOnly(termEnd, { year: 'numeric' });

  if (!termStart) return `Through ${endMonth} ${endYear}`;

  const startMonth = formatDateOnly(termStart, { month: 'short' });
  const startYear = formatDateOnly(termStart, { year: 'numeric' });

  return startYear === endYear
    ? `${startMonth}–${endMonth} ${endYear}`
    : `${startMonth} ${startYear}–${endMonth} ${endYear}`;
}
