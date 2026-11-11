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
    const { name, email, phone, city, background, offering, message, mode, date } = req.body || {};

    // Server-side validation
    if (!name || !email || !phone || !city || !offering) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Send notification to Academy
    await resend.emails.send({
      from: "LBFP Enquiry <onboarding@resend.dev>",
      to: ["theconsistentacademy@gmail.com"],
      replyTo: email,
      subject: `New LBFP Interest Submission: ${offering} – ${name}`,
      html: `
        <h2>New Leadership Bento Forward Program Interest Submission</h2>
        <p><strong>Programme Offering:</strong> ${offering}</p>
        <p><strong>Mode:</strong> ${mode || "Not specified"}</p>
        <p><strong>Preferred Dates:</strong> ${date || "Not specified"}</p>
        <hr />
        <p><strong>Full Name:</strong> ${name}</p>
        <p><strong>Email Address:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${phone}</p>
        <p><strong>City / Location:</strong> ${city}</p>
        <p><strong>Professional / Educational Background:</strong> ${background || "Not specified"}</p>
        <p><strong>Message / Goals:</strong> ${message || "None provided"}</p>
        <hr />
        <p style="font-size: 12px; color: #666;">This inquiry has also been stored in Firestore under collection 'lbfpEnquiries'.</p>
      `,
    });

    // 2. Send acknowledgment to submitter (best effort)
    try {
      await resend.emails.send({
        from: "The Consistent Academy <onboarding@resend.dev>",
        to: [email],
        subject: `Thank you for your interest in the Leadership Bento Forward Program!`,
        html: `
          <h3>Hello ${name},</h3>
          <p>Thank you for registering your interest in the <strong>Leadership Bento Forward Program (${offering})</strong> with The Consistent Academy.</p>
          <p>Our program coordinator will review your background and reach out to you shortly with detailed schedules, cohort availability, and orientation details.</p>
          <p>Warm regards,<br /><strong>The Consistent Academy Team</strong><br />Pune, Maharashtra</p>
        `,
      });
    } catch (ackError) {
      console.warn("Submitter acknowledgement email failed (non-blocking):", ackError);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("LBFP Enquiry API Error:", err);
    return res.status(500).json({ error: "Failed to send notification email" });
  }
}

