import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { clubMember } from '@/lib/db/schema';
import { EmailError, sendEmail } from '@/lib/email/resend';
import {
  getMemberWelcomeTemplate,
  getAdminNewMemberTemplate,
} from '@/lib/email/templates';
import { parseJoinSubmission } from '@/modules/members/joinSubmission';

export async function POST(req: Request) {
  try {
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid signup request.' },
        { status: 400 },
      );
    }

    const submission = parseJoinSubmission(body);
    if (!submission.success) {
      return NextResponse.json(
        { error: submission.error },
        { status: 400 },
      );
    }

    const { name, email, phone, major } = submission.data;
    const now = new Date();

    const [member] = await db
      .insert(clubMember)
      .values({
        name,
        email,
        phone,
        major,
        joinedAt: now,
        lastJoinedAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: clubMember.email,
        set: {
          name,
          phone,
          major,
          lastJoinedAt: now,
          updatedAt: now,
        },
      })
      .returning({ id: clubMember.id });

    const welcome = getMemberWelcomeTemplate({ name });
    const adminTemplate = getAdminNewMemberTemplate({
      name,
      email,
      phone,
      major,
    });

    const [welcomeResult, adminResult] = await Promise.allSettled([
      sendEmail({
        to: email,
        subject: welcome.subject,
        html: welcome.html,
        text: welcome.text,
      }),
      sendEmail({
        to: process.env.RESEND_EMAIL ?? 'newmancodingclub@gmail.com',
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text,
      }),
    ]);

    const emailErrors = [
      getEmailFailureCode('welcome', welcomeResult),
      getEmailFailureCode('admin', adminResult),
    ].filter((value): value is string => Boolean(value));

    await db
      .update(clubMember)
      .set({
        ...(welcomeResult.status === 'fulfilled'
          ? { welcomeEmailSentAt: now }
          : {}),
        lastEmailAttemptAt: now,
        lastEmailError: emailErrors.length ? emailErrors.join(',') : null,
        updatedAt: now,
      })
      .where(eq(clubMember.id, member.id));

    if (emailErrors.length) {
      console.error('Join emails were delayed after the submission was saved.', {
        memberId: member.id,
        failures: emailErrors,
      });
    }

    return NextResponse.json(
      {
        message: 'Signup received!',
        emailDelivery: emailErrors.length ? 'delayed' : 'sent',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Failed to process signup:', error);
    return NextResponse.json({ error: 'Failed to process signup' }, { status: 500 });
  }
}

function getEmailFailureCode(
  audience: 'welcome' | 'admin',
  result: PromiseSettledResult<unknown>,
): string | null {
  if (result.status === 'fulfilled') return null;

  const code =
    result.reason instanceof EmailError
      ? result.reason.code ?? 'UNKNOWN_ERROR'
      : 'UNKNOWN_ERROR';

  return `${audience}:${code}`;
}
