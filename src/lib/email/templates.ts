export function getVerificationEmailTemplate({
  userName,
  verificationUrl,
}: {
  userName: string;
  verificationUrl: string;
}) {
  return {
    subject: 'Verify your Newman Coding Club account',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">
                Welcome to Newman Coding Club!
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Hi ${userName},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Thanks for signing up! Please verify your email address by clicking the button below.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <a href="${verificationUrl}" style="display: inline-block; padding: 12px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                Verify Email Address
              </a>
            </td>
          </tr>

          <!-- Alternative link -->
          <tr>
            <td style="padding: 0 40px 20px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 20px; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #2563eb;">${verificationUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer info -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="padding: 0 40px;">
              <p style="margin: 0; font-size: 12px; line-height: 16px; color: #9ca3af; text-align: center;">
                © ${new Date().getFullYear()} Newman Coding Club. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Welcome to Newman Coding Club!

Hi ${userName},

Thanks for signing up! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.

© ${new Date().getFullYear()} Newman Coding Club. All rights reserved.
    `,
  };
}

export function getPasswordResetEmailTemplate({
  userName,
  resetUrl,
}: {
  userName: string;
  resetUrl: string;
}) {
  return {
    subject: 'Reset your Newman Coding Club password',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #111827;">
                Reset your Newman Coding Club password
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #374151;">
                Hi ${userName},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #374151;">
                We received a request to reset your password. Click the button below to create a new password.
              </p>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <a href="${resetUrl}" style="display: inline-block; padding: 12px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                Reset Password
              </a>
            </td>
          </tr>

          <!-- Alternative link -->
          <tr>
            <td style="padding: 0 40px 20px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 20px 0 0 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 8px 0 0 0; font-size: 14px; line-height: 20px; word-break: break-all;">
                <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                This link will expire in 1 hour for security reasons.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 20px; color: #6b7280;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
              </p>
            </td>
          </tr>
        </table>

        <!-- Footer info -->
        <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
          <tr>
            <td style="padding: 0 40px;">
              <p style="margin: 0; font-size: 12px; line-height: 16px; color: #9ca3af; text-align: center;">
                © ${new Date().getFullYear()} Newman Coding Club. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
    text: `
Reset your Newman Coding Club password

Hi ${userName},

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.

© ${new Date().getFullYear()} Newman Coding Club. All rights reserved.
    `,
  };
}

export function getMemberWelcomeTemplate({
  name,
}: {
  name: string;
}) {
  return {
    subject: 'Welcome to Newman Coding Club!',
    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Welcome to Newman Coding Club</title>
  </head>
  <body style="margin:0;background:#F3F3F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F3F3F5;padding:32px 12px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;box-shadow:0 5px 20px rgba(62,155,162,0.12);overflow:hidden;">
            <tr>
              <td style="background:#3e9ba2;padding:32px 40px;text-align:center;">
                <img src="https://newmancoding.club/images/logo.svg" alt="Newman Coding Club" width="72" height="72" style="display:block;margin:0 auto 12px;" />
                <h1 style="margin:0;font-size:24px;color:#ffffff;">Welcome to Newman Coding Club</h1>
                <p style="margin:8px 0 0;font-size:16px;color:#eaf8f9;">Let’s build something awesome together.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 40px;">
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">Hi ${name || 'there'},</p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 16px;">
                  Thanks for joining Newman Coding Club! We’re a community of students learning, collaborating, and leveling up our coding skills—no matter where you’re starting from.
                </p>
                <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">
                  Here’s what to do next:
                </p>
                <ol style="padding-left:20px;margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                  <li>Join our GroupMe to stay plugged into real-time updates.</li>
                  <li>Watch your inbox for workshop &amp; event announcements.</li>
                  <li>Follow us on social for highlights, recaps, and memes.</li>
                </ol>
                <div style="text-align:center;margin:32px 0;">
                  <a href="https://newmancoding.club/groupme" style="background:#10b981;color:#fff;border-radius:999px;padding:14px 32px;font-weight:600;text-decoration:none;display:inline-block;">Join Our GroupMe</a>
                </div>
                <p style="font-size:14px;line-height:1.6;color:#6b7280;text-align:center;margin-bottom:0;">
                  Prefer a direct link? Paste this in your browser:<br />
                  <a href="https://groupme.com/join_group/106407244/ylKLTabX" style="color:#3e9ba2;">groupme.com/join_group/106407244/ylKLTabX</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;border-top:1px solid #e5e7eb;">
                <p style="margin:0 0 12px;font-weight:600;color:#111827;">Connect with us</p>
                <p style="margin:0;line-height:1.6;font-size:15px;color:#374151;">
                  GitHub: <a href="https://newmancoding.club/github" style="color:#3e9ba2;">newmancoding.club/github</a><br />
                  Instagram: <a href="https://newmancoding.club/instagram" style="color:#3e9ba2;">@newmancodingclub</a><br />
                  Discord: <a href="https://newmancoding.club/discord" style="color:#3e9ba2;">newmancoding.club/discord</a>
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} Newman Coding Club • Newman University Wichita</p>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    text: `
Welcome to Newman Coding Club!

Hi ${name || 'there'},

Thanks for joining Newman Coding Club. Here’s what to do next:
1. Join our GroupMe: https://groupme.com/join_group/106407244/ylKLTabX
2. Watch your email for workshop and event announcements.
3. Follow us on social @newmancodingclub.

See you at the next meeting!

— Newman Coding Club
    `,
  };
}

export function getAdminNewMemberTemplate({
  name,
  email,
  phone,
  major,
}: {
  name: string;
  email: string;
  phone?: string;
  major: string;
}) {
  return {
    subject: 'New Newman Coding Club signup',
    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>New Member Signup</title>
  </head>
  <body style="margin:0;background:#F3F3F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F3F3F5;padding:32px 12px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,0.08);overflow:hidden;">
            <tr>
              <td style="background:#10b981;padding:24px 32px;text-align:center;color:#fff;">
                <p style="margin:0;font-size:18px;font-weight:600;">🎉 New member alert</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;">
                <p style="margin:0 0 16px;font-size:16px;">A new student just joined the club.</p>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8f9fa;border-radius:10px;">
                  <tbody>
                    ${[
                      { label: 'Name', value: name },
                      { label: 'Email', value: email },
                      { label: 'Phone', value: phone || 'Not provided' },
                      { label: 'Major', value: major },
                    ]
                      .map(
                        (item) => `
                      <tr>
                        <td style="padding:12px 16px;font-weight:600;color:#3e9ba2;width:120px;">${item.label}</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827;">${item.value}</td>
                      </tr>
                    `,
                      )
                      .join('')}
                  </tbody>
                </table>
                <p style="margin:24px 0 12px;font-size:15px;color:#374151;">
                  A confirmation email with the GroupMe link has already been sent to the student.
                </p>
                <div style="text-align:center;">
                  <a href="mailto:${email}" style="background:#3e9ba2;color:#fff;font-weight:600;border-radius:999px;padding:12px 24px;text-decoration:none;display:inline-block;">Reply to ${name}</a>
                </div>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">Newman Coding Club • Newman University Wichita</p>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    text: `
New student signup
------------------
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Major: ${major}

An automatic welcome email with the GroupMe link was sent to the student.
    `,
  };
}
