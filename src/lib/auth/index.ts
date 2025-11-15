import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email/resend';
import {
  getVerificationEmailTemplate,
  getPasswordResetEmailTemplate,
} from '@/lib/email/templates';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        const template = getPasswordResetEmailTemplate({
          userName: user.name,
          resetUrl: url,
        });

        await sendEmail({
          to: user.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw error;
      }
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const template = getVerificationEmailTemplate({
          userName: user.name,
          verificationUrl: url,
        });

        await sendEmail({
          to: user.email,
          subject: template.subject,
          html: template.html,
          text: template.text,
        });
      } catch (error) {
        console.error('Failed to send verification email:', error);
        throw error;
      }
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 15,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 15,
    }
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false,
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
