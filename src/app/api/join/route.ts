import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, major } = await req.json();

    // Format the major for display
    const formattedMajor = major ? 
      (major === 'fa' ? 'Fine Arts' : 
       major === 'hc' ? 'Healthcare' : 
       major === 'stem' ? 'STEM' : 
       major === 'da' ? 'Data Analytics' : 
       major === 'cs' ? 'Computer Science' : 'Not specified') : 
      'Not specified';

    // 1. First, send confirmation email to the student
    const studentEmailResult = await resend.emails.send({
      from: 'Newman Coding Club <info@newmancoding.club>',
      to: [email], // Send to student's email
      subject: 'Welcome to Newman Coding Club!',
      // Plain text version to improve deliverability
      text: `
Welcome to Newman Coding Club!

Hi ${name},

Thank you for joining the Newman Coding Club! We're excited to have you with us and look forward to coding together.

As a member, you'll have access to workshops, projects, events, and a supportive community of fellow student coders. No matter your experience level, we're here to help you learn and grow your programming skills.

Next Steps:
1. Join our GroupMe: https://groupme.com/join_group/106407244/ylKLTabX
2. Check your email for upcoming meeting announcements
3. Follow us on social media for club updates

See you at our next meeting!

Newman Coding Club Team
Newman University Wichita
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>Welcome to Newman Coding Club</title>
  <style>
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      table.body p,
      table.body ul,
      table.body ol,
      table.body td,
      table.body span {
        font-size: 16px !important;
      }
      table.body .content {
        padding: 0 !important;
      }
      table.body .container {
        padding: 0 !important;
        width: 100% !important;
      }
      table.body .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
    }
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
    }
  </style>
</head>
<body style="background-color: #F3F3F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; width: 100%; background-color: #F3F3F5;">
    <tr>
      <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top;">&nbsp;</td>
      <td class="container" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto !important;">
        <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
          <!-- START CENTERED WHITE CONTAINER -->
          <table role="presentation" class="main" style="border-collapse: separate; width: 100%; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <!-- START MAIN CONTENT AREA -->
            <tr>
              <td class="wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top;">
                      <!-- Logo and Header -->
                      <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://newmancoding.club/images/logo.svg" alt="Newman Coding Club Logo" style="width: 80px; height: 80px;">
                        <h1 style="color: #3e9ba2; font-size: 24px; font-weight: bold; margin: 15px 0 0;">Newman Coding Club</h1>
                        <p style="color: #454545; font-size: 16px; margin: 5px 0 0;">Welcome to the club!</p>
                      </div>
                      
                      <!-- Welcome Message -->
                      <div style="margin-bottom: 25px;">
                        <p style="margin-bottom: 15px;">Hi ${name},</p>
                        <p style="margin-bottom: 15px;">Thank you for joining the Newman Coding Club! We're excited to have you with us and look forward to coding together.</p>
                        <p style="margin-bottom: 15px;">As a member, you'll have access to workshops, projects, events, and a supportive community of fellow student coders. No matter your experience level, we're here to help you learn and grow your programming skills.</p>
                      </div>
                      
                      <!-- Next Steps -->
                      <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
                        <h2 style="color: #3e9ba2; font-size: 18px; margin-top: 0; margin-bottom: 15px;">Next Steps:</h2>
                        <ol style="margin: 0; padding-left: 20px;">
                          <li style="margin-bottom: 10px;"><strong>Join our GroupMe</strong> using the button below to stay updated on all club activities</li>
                          <li style="margin-bottom: 10px;"><strong>Check your email</strong> for upcoming meeting announcements</li>
                          <li style="margin-bottom: 0;"><strong>Follow us</strong> on social media for club updates</li>
                        </ol>
                      </div>
                      
                      <!-- CTA Button -->
                      <div style="text-align: center; margin: 30px 0;">
                        <a href="https://newmancoding.club/groupme" style="background-color: #3e9ba2; border-radius: 50px; color: white; display: inline-block; font-size: 16px; font-weight: bold; padding: 12px 25px; text-decoration: none; text-align: center;">Join Our GroupMe</a>
                      </div>
                      
                      <!-- Direct Link (in case button doesn't work) -->
                      <div style="text-align: center; margin-bottom: 25px; font-size: 14px;">
                        <p>Or copy and paste this link in your browser:</p>
                        <p style="word-break: break-all;">https://newmancoding.club</p>
                      </div>
                      
                      <!-- Social Links -->
                      <div style="text-align: center; margin-bottom: 25px;">
                        <p style="margin-bottom: 10px; font-weight: bold;">Connect with us:</p>
                        <p>
                          GitHub: newmancoding.club/github<br>
                          Instagram: newmancoding.club/instagram/<br>
                          Discord: newmancoding.club/discord/<br>
                        </p>
                      </div>
                      
                      <!-- Signature -->
                      <p style="margin-top: 30px; margin-bottom: 5px;">See you at our next meeting!</p>
                      <p style="margin-top: 0; margin-bottom: 0;"><strong>Ariana Sweitzer</strong></p>
                      <p style="margin-top: 0; margin-bottom: 0;">Secretary, Newman Coding Club</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- END MAIN CONTENT AREA -->
          </table>
          <!-- END CENTERED WHITE CONTAINER -->
          
          <!-- START FOOTER -->
          <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
              <tr>
                <td class="content-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;">
                  <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Newman Coding Club, Newman University Wichita</span>
                </td>
              </tr>
            </table>
          </div>
          <!-- END FOOTER -->
        </div>
      </td>
      <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top;">&nbsp;</td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    // If there was an error with the student email, log it but continue to try sending the admin email
    if (studentEmailResult.error) {
      console.error('Error sending email to student:', studentEmailResult.error);
    }

    // 2. Send notification email to the club admin
    const adminEmailResult = await resend.emails.send({
      from: 'Newman Coding Club <info@newmancoding.club>',
      to: [process.env.RESEND_EMAIL || 'newmancodingclub@gmail.com'],
      subject: 'New Member Signup!',
      // Plain text version to improve deliverability
      text: `
New Newman Coding Club Member!

A new member has signed up:

Name: ${name}
Email: ${email}
Phone: ${phone}
Major: ${formattedMajor}

An automatic welcome email with the GroupMe link has been sent to the student.

To contact the student directly: ${email}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <title>New Club Signup</title>
  <style>
    @media only screen and (max-width: 620px) {
      table.body h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      table.body p,
      table.body ul,
      table.body ol,
      table.body td,
      table.body span {
        font-size: 16px !important;
      }
      table.body .content {
        padding: 0 !important;
      }
      table.body .container {
        padding: 0 !important;
        width: 100% !important;
      }
      table.body .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
    }
    @media all {
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }
    }
  </style>
</head>
<body style="background-color: #F3F3F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; width: 100%; background-color: #F3F3F5;">
    <tr>
      <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top;">&nbsp;</td>
      <td class="container" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top; display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0 auto !important;">
        <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px;">
          <!-- START CENTERED WHITE CONTAINER -->
          <table role="presentation" class="main" style="border-collapse: separate; width: 100%; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
            <!-- START MAIN CONTENT AREA -->
            <tr>
              <td class="wrapper" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
                  <tr>
                    <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top;">
                      <!-- Logo and Header -->
                      <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://newmancoding.club/images/logo.svg" alt="Newman Coding Club Logo" style="width: 80px; height: 80px;">
                        <h1 style="color: #3e9ba2; font-size: 24px; font-weight: bold; margin: 15px 0 0;">Newman Coding Club</h1>
                        <p style="color: #454545; font-size: 16px; margin: 5px 0 0;">New Member Signup</p>
                      </div>
                      
                      <!-- Notification Banner -->
                      <div style="background-color: #10b981; color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
                        <p style="margin: 0; font-weight: bold; font-size: 18px;">🎉 New Member Alert!</p>
                      </div>
                      
                      <!-- Member Information -->
                      <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
                          <tr>
                            <td style="padding: 10px 10px 10px 0; width: 100px; color: #454545; font-weight: bold;">Name:</td>
                            <td style="padding: 10px 0; color: #171717;">${name}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 10px 10px 0; width: 100px; color: #454545; font-weight: bold;">Email:</td>
                            <td style="padding: 10px 0; color: #171717;">${email}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 10px 10px 0; width: 100px; color: #454545; font-weight: bold;">Phone:</td>
                            <td style="padding: 10px 0; color: #171717;">${phone}</td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 10px 10px 0; width: 100px; color: #454545; font-weight: bold;">Major:</td>
                            <td style="padding: 10px 0; color: #171717;">${formattedMajor}</td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Admin Actions -->
                      <div style="text-align: center; margin: 25px 0;">
                        <p style="margin-bottom: 15px;">An automatic welcome email with the GroupMe link has been sent to the student.</p>
                        <a href="mailto:${email}" style="background-color: #3e9ba2; border-radius: 50px; color: white; display: inline-block; font-size: 16px; font-weight: bold; padding: 12px 25px; text-decoration: none; text-align: center;">Contact Student</a>
                      </div>
                      
                      <!-- Footer text -->
                      <p style="color: #454545; font-size: 14px; text-align: center; margin-top: 30px;">This is an automated message from the Newman Coding Club website.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- END MAIN CONTENT AREA -->
          </table>
          <!-- END CENTERED WHITE CONTAINER -->
          
          <!-- START FOOTER -->
          <div class="footer" style="clear: both; margin-top: 10px; text-align: center; width: 100%;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
              <tr>
                <td class="content-block" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; vertical-align: top; padding-bottom: 10px; padding-top: 10px; color: #999999; font-size: 12px; text-align: center;">
                  <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Newman Coding Club, Newman University Wichita</span>
                </td>
              </tr>
            </table>
          </div>
          <!-- END FOOTER -->
        </div>
      </td>
      <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; font-size: 16px; vertical-align: top;">&nbsp;</td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    // Log any error with the admin email but don't fail the request
    if (adminEmailResult.error) {
      console.error('Error sending email to admin:', adminEmailResult.error);
    }

    // Return success as long as at least one email was sent
    if (studentEmailResult.error && adminEmailResult.error) {
      return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Signup successful!' }, { status: 200 });
  } catch (error) {
    console.error('Failed to process signup:', error);
    return NextResponse.json({ error: 'Failed to process signup' }, { status: 500 });
  }
}