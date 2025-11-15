import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';
import {
  getMemberWelcomeTemplate,
  getAdminNewMemberTemplate,
} from '@/lib/email/templates';

const majorLabels: Record<string, string> = {
  fa: 'Fine Arts',
  hc: 'Healthcare',
  stem: 'STEM',
  da: 'Data Analytics',
  cs: 'Computer Science',
};

export async function POST(req: Request) {
  try {
    const { name, email, phone, major } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // validation
    if (!name || !email || !phone || !major) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (!email.endsWith('@newmanu.edu')) {
      return NextResponse.json({ error: 'Please use your Newman University email (@newmanu.edu).' }, { status: 400 });
    }
    if (!phone.match(/^\d{10}$/)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit phone number.' }, { status: 400 });
    }

    const formattedMajor =
      (typeof major === 'string' && majorLabels[major.toLowerCase()]) ||
      (major && typeof major === 'string' && major.trim()) ||
      'Not specified';

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
      major: formattedMajor,
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
