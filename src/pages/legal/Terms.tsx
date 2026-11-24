import { Link } from "react-router-dom";
import { LegalPage, CONTACT_EMAIL } from "./LegalPage";

/* TODO(owner): have this reviewed before relying on it; it is a plain-language draft, not legal advice. */
const Terms = () => (
  <LegalPage
    title="Terms of Service"
    path="/terms"
    intro={
      <p>
        By using theconsistentacademy.in or enrolling in a course, programme or webinar run by The Consistent Academy,
        you agree to these terms. If you are enrolling a child, you agree on their behalf as parent or guardian.
      </p>
    }
    sections={[
      {
        heading: "Courses and programmes",
        body: (
          <p>
            Course descriptions, schedules, batch timings and fees shown on the website are accurate to the best of our
            knowledge and may be updated. Your enrolment is confirmed only after payment is received and we acknowledge it.
          </p>
        ),
      },
      {
        heading: "Fees and payment",
        body: (
          <ul>
            <li>Fees are in Indian Rupees and are payable in full at enrolment unless an instalment plan is agreed in writing.</li>
            <li>Payments are processed by Razorpay (UPI). We never see your UPI PIN or bank credentials.</li>
            <li>Early-bird, sibling, school and other discounts apply only as described on the course page and cannot be combined unless stated.</li>
            <li>Refunds and cancellations are governed by our <Link to="/refund-policy">Refund &amp; Cancellation Policy</Link>.</li>
          </ul>
        ),
      },
      {
        heading: "Attendance and conduct",
        body: (
          <p>
            Learners are expected to attend sessions, take part respectfully and follow trainers' instructions. We may
            remove a participant whose conduct disrupts others or is unsafe, in which case the refund policy applies.
          </p>
        ),
      },
      {
        heading: "Results and outcomes",
        body: (
          <p>
            We teach to the best of our ability, but we cannot guarantee a particular exam score, job offer or other
            outcome; results depend on individual effort and circumstances. IELTS, TOEFL, PTE and CELPIP are
            trademarks of their respective owners and are not affiliated with us.
          </p>
        ),
      },
      {
        heading: "Content and intellectual property",
        body: (
          <p>
            Course material, recordings, tests, books and website content belong to The Consistent Academy or its
            licensors. You may use them for your own learning but may not copy, resell or share them publicly without
            written permission.
          </p>
        ),
      },
      {
        heading: "Accounts and the CC Club",
        body: (
          <p>
            You are responsible for keeping your login secure and for the accuracy of what you submit. Content you submit
            (such as speeches or blog posts) must be your own and appropriate; we may reject or remove content that is
            not. President and Trainer roles require approval by the academy.
          </p>
        ),
      },
      {
        heading: "Limitation of liability",
        body: (
          <p>
            To the extent the law allows, our liability for any claim related to a course or this website is limited to
            the fees you paid for that course. We are not liable for indirect or consequential loss, or for interruptions
            outside our control.
          </p>
        ),
      },
      {
        heading: "Governing law and contact",
        body: (
          <p>
            These terms are governed by the laws of India, with courts at Pune, Maharashtra having jurisdiction. For any
            question, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>.
          </p>
        ),
      },
    ]}
  />
);

export default Terms;
