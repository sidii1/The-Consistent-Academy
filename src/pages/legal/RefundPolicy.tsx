import { Link } from "react-router-dom";
import { LegalPage, CONTACT_EMAIL, CONTACT_PHONE } from "./LegalPage";

/*
 * TODO(owner): CONFIRM THESE NUMBERS. They are conservative placeholders, not an
 * agreed commercial policy. Edit them here and the page updates everywhere.
 */
const FULL_REFUND_DAYS = 7; // days after payment in which a full refund is possible (if no session attended)
const PARTIAL_REFUND_PERCENT = 50; // refund after the first session, before the course is half done
const PROCESSING_DAYS = "5–7 working days"; // time for money to reach the learner's account

const RefundPolicy = () => (
  <LegalPage
    title="Refund & Cancellation Policy"
    path="/refund-policy"
    intro={
      <p>
        We want every learner to be confident in their enrolment. This page explains when you can cancel, what is
        refunded and how long it takes.
      </p>
    }
    sections={[
      {
        heading: "Cancelling before the course starts",
        body: (
          <p>
            If you cancel within {FULL_REFUND_DAYS} days of paying and before attending any session, you will receive a
            full refund.
          </p>
        ),
      },
      {
        heading: "Cancelling after the course has started",
        body: (
          <p>
            After the first session, a {PARTIAL_REFUND_PERCENT}% refund is available if you cancel before the course is
            half complete. After that point fees are non-refundable, as seats and trainer time are committed.
          </p>
        ),
      },
      {
        heading: "Batch changes and missed sessions",
        body: (
          <p>
            If the batch timing does not suit you, ask us before the course starts and we will move you to another
            batch where seats are available. Missed sessions are not refunded, but we will share the material and, where
            possible, offer a catch-up.
          </p>
        ),
      },
      {
        heading: "If we cancel or reschedule",
        body: (
          <p>
            If we cancel a batch or cannot offer a suitable alternative date, you will get a full refund, or a credit
            towards another course, whichever you prefer.
          </p>
        ),
      },
      {
        heading: "Webinars, workshops and tests",
        body: (
          <p>
            Paid webinars and workshops can be cancelled for a full refund up to 24 hours before they begin. Test and
            assessment fees are non-refundable once the test has been attempted.
          </p>
        ),
      },
      {
        heading: "How to request a refund",
        body: (
          <p>
            Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or call {CONTACT_PHONE} with the learner's name,
            the email or phone used for payment, and the reason. We will reply within 2 working days.
          </p>
        ),
      },
      {
        heading: "How refunds are paid",
        body: (
          <p>
            Approved refunds are returned to the original payment method (the UPI account used to pay) within{" "}
            {PROCESSING_DAYS}. Bank processing time may vary. See also our <Link to="/terms">Terms of Service</Link>.
          </p>
        ),
      },
    ]}
  />
);

export default RefundPolicy;
