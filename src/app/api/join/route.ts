import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';
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

    const welcome = getMemberWelcomeTemplate({ name });
    await sendEmail({
      to: email,
      subject: welcome.subject,
      html: welcome.html,
      text: welcome.text,
    });

    const adminTemplate = getAdminNewMemberTemplate({
      name,
      email,
      phone,
      major,
    });
    await sendEmail({
      to: process.env.RESEND_EMAIL ?? 'newmancodingclub@gmail.com',
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text,
    });

    return NextResponse.json({ message: 'Signup successful!' }, { status: 200 });
  } catch (error) {
    console.error('Failed to process signup:', error);
    return NextResponse.json({ error: 'Failed to process signup' }, { status: 500 });
  }
}
