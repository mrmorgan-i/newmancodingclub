import { Resend } from 'resend';

export class EmailError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'EmailError';
  }
}

export class EmailServiceError extends EmailError {
  constructor(message: string = 'Email service temporarily unavailable') {
    super(message, 'SERVICE_ERROR', 503);
    this.name = 'EmailServiceError';
  }
}

export class EmailValidationError extends EmailError {
  constructor(message: string = 'Invalid email configuration') {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'EmailValidationError';
  }
}

function handleEmailError(error: unknown): never {
  if (error instanceof EmailError) throw error;

  const errorRecord =
    error && typeof error === 'object'
      ? (error as Record<string, unknown>)
      : null;
  const message =
    error instanceof Error
      ? error.message
      : typeof errorRecord?.message === 'string'
        ? errorRecord.message
        : 'Unknown email error';
  const statusCode =
    typeof errorRecord?.statusCode === 'number'
      ? errorRecord.statusCode
      : undefined;
  const normalizedMessage = message.toLowerCase();

  if (
    statusCode === 429 ||
    normalizedMessage.includes('rate limit') ||
    normalizedMessage.includes('quota')
  ) {
    throw new EmailServiceError(
      'Email sending limit exceeded. Please try again later.',
    );
  }

  if (
    statusCode === 401 ||
    statusCode === 403 ||
    normalizedMessage.includes('api key') ||
    normalizedMessage.includes('authentication') ||
    normalizedMessage.includes('unauthorized')
  ) {
    throw new EmailServiceError('Email service authentication failed.');
  }

  if (
    statusCode === 400 ||
    statusCode === 422 ||
    normalizedMessage.includes('invalid') ||
    normalizedMessage.includes('malformed')
  ) {
    throw new EmailValidationError('Invalid email format or configuration.');
  }

  throw new EmailError(message, 'UNKNOWN_ERROR', statusCode ?? 500);
}

export const FROM_EMAIL = 'Newman Coding Club <info@newmancoding.club>';

function getEmailClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new EmailServiceError('Email service is not configured.');
  }

  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}) {
  try {
    if (!html && !text) {
      throw new EmailValidationError('Either html or text content must be provided');
    }

    if (!to || !subject) {
      throw new EmailValidationError('Recipient and subject are required');
    }

    const emailPayload = html
      ? {
          from: from ?? process.env.RESEND_FROM_EMAIL ?? FROM_EMAIL,
          to,
          subject,
          html,
          ...(text && { text }),
        }
      : {
          from: from ?? process.env.RESEND_FROM_EMAIL ?? FROM_EMAIL,
          to,
          subject,
          text: text!,
        };

    const { data, error } = await getEmailClient().emails.send(emailPayload);

    if (error) {
      console.error('Resend API error:', {
        name: error.name,
        message: error.message,
      });
      handleEmailError(error);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    handleEmailError(error);
  }
}
