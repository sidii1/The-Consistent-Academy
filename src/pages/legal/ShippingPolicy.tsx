import { LegalPage, CONTACT_EMAIL } from "./LegalPage";

/* TODO(owner): confirm delivery modes and timelines. */
const ShippingPolicy = () => (
  <LegalPage
    title="Service Delivery Policy"
    path="/shipping-policy"
    intro={
      <p>
        The Consistent Academy sells educational services rather than shipped goods. This page explains how and when
        you receive what you have paid for.
      </p>
    }
    sections={[
      {
        heading: "Courses and programmes",
        body: (
          <p>
            Courses are delivered live, online or at our Pune centre, as shown on the course page. After payment you
            receive a confirmation with batch details. Joining links or venue information are shared before the first
            session.
          </p>
        ),
      },
      {
        heading: "Webinars and workshops",
        body: <p>Joining instructions are emailed after registration and again before the event.</p>,
      },
      {
        heading: "Receipts and confirmations",
        body: (
          <p>
            A receipt is emailed to the address you provide as soon as your payment is confirmed, normally within a few
            minutes. If you have not received it, check your spam folder or email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        ),
      },
      {
        heading: "Printed books and materials",
        body: (
          <p>
            Course material is normally shared digitally. Where printed material is included, it is handed over in
            class or dispatched within 7 working days to the address you provide; delivery in India usually takes
            3–7 further working days.
          </p>
        ),
      },
    ]}
  />
);

export default ShippingPolicy;
