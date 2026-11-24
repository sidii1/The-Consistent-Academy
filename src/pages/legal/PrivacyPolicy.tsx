import { LegalPage, CONTACT_EMAIL } from "./LegalPage";

/* TODO(owner): have this reviewed before relying on it; it is a plain-language draft, not legal advice. */
const PrivacyPolicy = () => (
  <LegalPage
    title="Privacy Policy"
    path="/privacy-policy"
    intro={
      <p>
        The Consistent Academy ("we", "us") runs courses and programmes in communication, IELTS preparation, leadership
        and public speaking from Pune, Maharashtra, and online. This policy explains what personal information we
        collect through theconsistentacademy.in, why, and the choices you have.
      </p>
    }
    sections={[
      {
        heading: "Information we collect",
        body: (
          <ul>
            <li><strong>Enquiries and registrations:</strong> name, email, phone number, course of interest and any message you send through our contact, programme-enquiry and webinar forms.</li>
            <li><strong>Enrolment and payment details:</strong> name, email, phone, the student's name, school and batch preferences, and the order and payment status. We do not see or store your UPI PIN, card or bank credentials; payments are processed by Razorpay.</li>
            <li><strong>Accounts:</strong> if you create a CC Club account, your name, email and club role, and the speeches, videos and reports you submit.</li>
            <li><strong>Test results:</strong> answers and scores from the assessments on our Tests page.</li>
            <li><strong>Usage data:</strong> pages visited, device and browser type, and approximate location, collected through Google Analytics cookies.</li>
          </ul>
        ),
      },
      {
        heading: "Children's information",
        body: (
          <p>
            Many of our courses are for children. Information about a child is collected only from a parent or guardian,
            or with their consent, and is used solely to run the course. Parents may ask us to access, correct or delete
            their child's information at any time.
          </p>
        ),
      },
      {
        heading: "How we use information",
        body: (
          <ul>
            <li>To respond to enquiries and register you for courses, webinars and workshops.</li>
            <li>To process payments and send receipts and course communication.</li>
            <li>To run the CC Club, evaluate speeches and track progress.</li>
            <li>To understand how the website is used and to improve it.</li>
            <li>To meet legal and accounting obligations.</li>
          </ul>
        ),
      },
      {
        heading: "Who we share it with",
        body: (
          <>
            <p>We do not sell personal information. We share it only with service providers that help us operate:</p>
            <ul>
              <li>Google Firebase (database and sign-in) and Cloudinary (image and file hosting).</li>
              <li>Razorpay (payment processing) and Resend (transactional email).</li>
              <li>Google Analytics (website usage statistics).</li>
            </ul>
            <p>We may also disclose information where the law requires it.</p>
          </>
        ),
      },
      {
        heading: "Cookies and analytics",
        body: (
          <p>
            We use Google Analytics to count visits and see which pages are useful. It sets cookies in your browser. You
            can block or delete cookies in your browser settings, or install Google's opt-out add-on; the site works
            without them.
          </p>
        ),
      },
      {
        heading: "How long we keep it",
        body: (
          <p>
            We keep enquiry and enrolment records for as long as needed to run the course and meet accounting and legal
            requirements, then delete or anonymise them. CC Club content is kept while your account is active.
          </p>
        ),
      },
      {
        heading: "Security",
        body: (
          <p>
            Data is stored with reputable cloud providers using access controls and encrypted connections. No system is
            perfectly secure, but we take reasonable steps to protect your information.
          </p>
        ),
      },
      {
        heading: "Your rights",
        body: (
          <p>
            Under India's Digital Personal Data Protection Act, 2023 you may ask to access, correct or erase your
            personal data, withdraw consent, or raise a grievance. Write to us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will respond within a reasonable time.
          </p>
        ),
      },
      {
        heading: "Changes and contact",
        body: (
          <p>
            We may update this policy and will change the "last updated" date above when we do. Questions? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        ),
      },
    ]}
  />
);

export default PrivacyPolicy;
