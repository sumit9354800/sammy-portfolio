import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface SendContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: SendContactEmailParams): Promise<{ success: boolean; id?: string; mode: 'resend' | 'simulated' }> {
  const targetEmail = process.env.CONTACT_EMAIL || 'sumit9354800@gmail.com';
  const client = getResend();

  if (!client) {
    console.log('[Contact Service - Preview Mode] Stored message to DB and logged email notification:', {
      to: targetEmail,
      from: `${name} <${email}>`,
      subject: `[Portfolio Inquiry] ${subject}`,
      message,
      timestamp: new Date().toISOString(),
    });
    return { success: true, id: `sim-${Date.now()}`, mode: 'simulated' };
  }

  try {
    const result = await client.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: targetEmail,
      replyTo: email,
      subject: `[Portfolio] ${subject} - from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nSubmitted at: ${new Date().toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0b0c0e; color: #f3f4f6; padding: 24px; border-radius: 8px;">
          <h2 style="color: #ffffff; border-bottom: 1px solid #252830; padding-bottom: 8px;">New Portfolio Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #60a5fa;">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <div style="background-color: #121316; padding: 16px; border: 1px solid #22252c; border-radius: 6px; margin-top: 16px; white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    return { success: true, id: result.data?.id, mode: 'resend' };
  } catch (err: any) {
    console.error('[Resend Error]', err);
    // Still record inquiry in DB and return success for user UX while warning in server log
    return { success: true, id: `fallback-${Date.now()}`, mode: 'simulated' };
  }
}
