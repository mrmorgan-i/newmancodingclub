import { isNewmanEmail, normalizeEmail } from '@/lib/auth/emailPolicy';

const majorLabels: Record<string, string> = {
  fa: 'Fine Arts',
  hc: 'Healthcare',
  stem: 'STEM',
  da: 'Data Analytics',
  cs: 'Computer Science',
};

export type JoinSubmission = {
  name: string;
  email: string;
  phone: string;
  major: string;
};

export type JoinSubmissionResult =
  | { success: true; data: JoinSubmission }
  | { success: false; error: string };

function readString(
  value: unknown,
  { maxLength }: { maxLength: number },
): string | null {
  if (typeof value !== 'string') return null;

  const normalized = value.trim();
  if (normalized.length > maxLength) return null;

  return normalized;
}

export function normalizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function parseJoinSubmission(input: unknown): JoinSubmissionResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { success: false, error: 'Invalid signup request.' };
  }

  const body = input as Record<string, unknown>;
  const name = readString(body.name, { maxLength: 100 });
  const rawEmail = readString(body.email, { maxLength: 320 });
  const rawPhone = readString(body.phone, { maxLength: 40 });
  const rawMajor = readString(body.major, { maxLength: 100 });

  if (!name || !rawEmail || !rawPhone) {
    return { success: false, error: 'Name, email, and phone are required.' };
  }

  const email = normalizeEmail(rawEmail);
  if (!isNewmanEmail(email)) {
    return {
      success: false,
      error: 'Please use your Newman University email (@newmanu.edu).',
    };
  }

  const phone = normalizePhoneNumber(rawPhone);
  if (!/^\d{10}$/.test(phone)) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit phone number.',
    };
  }

  const majorKey = rawMajor?.toLowerCase() ?? '';

  return {
    success: true,
    data: {
      name,
      email,
      phone,
      major: majorLabels[majorKey] ?? (rawMajor || 'Not specified'),
    },
  };
}
