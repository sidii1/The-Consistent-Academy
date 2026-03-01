import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your_app_password", 
  },
});

export const sendBlogForApproval = functions.firestore
  .document("blogs/{blogId}")
  .onCreate(async (snap, context) => {
    const blog = snap.data();

    const mailOptions = {
      from: "yourgmail@gmail.com",
      to: "yourgmail@gmail.com",
      subject: "New Blog Submitted for Approval",
      html: `
        <h2>${blog.title}</h2>
        <p><strong>Author:</strong> ${blog.author}</p>
        <p>${blog.content}</p>
        <p>
          Approve in Firebase Console by changing status to "approved"
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return null;
  });