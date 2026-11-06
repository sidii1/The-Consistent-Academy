import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, email, phone, webinarId, webinarTitle } = req.body || {};

    // Server-side validation
    if (!name || !email || !phone || !webinarTitle) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Send notification to Academy
    await resend.emails.send({
      from: "Webinar Registration <onboarding@resend.dev>",
      to: ["theconsistentacademy@gmail.com"],
      replyTo: email,
      subject: `New Webinar Registration: ${webinarTitle} – ${name}`,
      html: `
        <h2>New Webinar Registration</h2>
        <p><strong>Webinar Title:</strong> ${webinarTitle}</p>
        <p><strong>Webinar Identifier:</strong> ${webinarId || "N/A"}</p>
        <hr />
        <p><strong>Registrant Name:</strong> ${name}</p>
        <p><strong>Email Address:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${phone}</p>
        <hr />
        <p style="font-size: 12px; color: #666;">This registration has been stored in Firestore under collection 'webinarRegistrations'. Payment integration is deferred for this phase.</p>
      `,
    });

    // 2. Send acknowledgment to registrant (best effort)
    try {
      await resend.emails.send({
        from: "The Consistent Academy <onboarding@resend.dev>",
        to: [email],
        subject: `Confirmed: Your registration for "${webinarTitle}"`,
        html: `
          <h3>Hello ${name},</h3>
          <p>Thank you for registering for our upcoming session: <strong>${webinarTitle}</strong>.</p>
          <p>We have reserved your interest. The session link and reminders will be emailed to you prior to the event.</p>
          <p>Warm regards,<br /><strong>The Consistent Academy Team</strong><br />theconsistentacademy@gmail.com</p>
        `,
      });
    } catch (ackError) {
      console.warn("Registrant acknowledgement email failed (non-blocking):", ackError);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webinar Registration API Error:", err);
    return res.status(500).json({ error: "Failed to send notification email" });
  }
}

