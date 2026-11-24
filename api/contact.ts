import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { esc } from "./_lib/html.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, email, phone, course, message } = req.body;

    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["theconsistentacademy@gmail.com"],
      replyTo: email,
      subject: `New Contact Form Submission – ${name}`,
      html: `
        <h3>New Contact Request</h3>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> ${esc(email)}</p>
        <p><strong>Phone:</strong> ${esc(phone || "N/A")}</p>
        <p><strong>Course:</strong> ${esc(course || "N/A")}</p>
        <hr />
        <p>${esc(message)}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
