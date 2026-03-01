import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/submit-blog", async (req, res) => {
  try {
    const { title, content, author } = req.body;

    await resend.emails.send({
      from: "Blog Approval <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL,
      subject: "New Blog Waiting for Approval",
      html: `
        <h2>${title}</h2>
        <p><b>Author:</b> ${author}</p>
        <p>${content}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email failed" });
  }
});

export default router;