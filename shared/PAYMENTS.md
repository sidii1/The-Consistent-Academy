# Payments (Razorpay dynamic UPI QR)

## Files
| File | Role |
|---|---|
| `shared/pricing.ts` | **Only** place prices/discounts live. Used by UI and server. |
| `shared/receipt.ts` | Receipt HTML (download button + email). |
| `api/create-payment.ts` | Validates, recomputes price, stores order, creates single-use fixed-amount QR. |
| `api/payment-status.ts` | Polled by the modal; reconciles with Razorpay while unsettled. |
| `api/razorpay-webhook.ts` | Signed webhook → settles orders (live-mode source of truth). |
| `api/simulate-payment.ts` | Test-mode only (needs `ALLOW_PAYMENT_SIMULATION=true` + `rzp_test_` key). |
| `api/_lib/payments.ts` | `markPaid` (idempotent, only place that sets `paid`, sends emails), `reconcile`. |
| `src/components/payments/PaymentModal.tsx` | Form → QR → success / "Payment Failed." |
| `vite.config.ts` | Dev-only middleware so `/api/*` works under `npm run dev`. |

Firestore `payments/{orderId}`: `created → pending → paid | failed | expired`. `payment_webhook_events/{eventId}`: dedupe log.

## Going live checklist
1. Razorpay KYC done → Dashboard (Live mode) → generate API keys.
2. Vercel env (Production): `RAZORPAY_KEY_ID=rzp_live_…`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `FIREBASE_SERVICE_ACCOUNT`, `EMAIL_FROM`. Leave `ALLOW_PAYMENT_SIMULATION` unset.
3. Ask Razorpay Support to activate **UPI QR** (`upi_qr`) for the account if `create-payment` returns an authorisation/feature error.
4. Dashboard → Webhooks → Add: URL `https://<domain>/api/razorpay-webhook`, secret = `RAZORPAY_WEBHOOK_SECRET`, events `qr_code.credited` + `qr_code.closed`. (Test and live webhooks are configured separately.)
5. Verify a Resend domain and set `EMAIL_FROM`, otherwise emails only reach the Resend account owner.
6. Replace the placeholders in `shared/pricing.ts`: `EARLY_BIRD_DEADLINE_ISO`, `WORKSHOP_DATES`; fill `INSTALMENT_PLANS` once decided.
7. Do one real ₹-small payment, confirm receipt + email + Firestore `paid`, then refund from the dashboard.




Everything in the brief is built and passes `tsc` and `npm run build`, but nothing has been tried in a browser or with a real Razorpay call. The keys in `.env` are still blank, so `/api/create-payment` returns a clean "Payments are not configured yet" 503 for now.

## What I checked
- **Prices:** all 9 discounted prices match your price sheet exactly.
- **Validation:** bad emails, an unknown product, a discount on a kids course, a school group under 10 and a sibling discount with no name are all rejected.
- **Webhook signature:** a bad signature or tampered body returns 400, and a good signature returns 200. This ran against a local dev instance with fake keys and a throwaway secret.
- **Not checked:** the UI visually, Razorpay's QR response, and the Firestore writes. Those need real keys.

## How a payment works
1. The parent clicks **Enrol** and a modal asks for details and one discount.
2. The browser sends only a product ID and discount type, never an amount. The server recomputes the price from [shared/pricing.ts](shared/pricing.ts), so a tampered request can't change what's charged.
3. [api/create-payment.ts](api/create-payment.ts) saves the order in Firestore and creates a single-use fixed-amount Razorpay QR that expires in 15 minutes. The modal shows the QR with a countdown.
4. The modal asks [api/payment-status.ts](api/payment-status.ts) every 3 seconds. That route checks Razorpay directly, so test mode works without any webhook.
5. On success the QR is removed and "Payment Received and Confirmed." appears, with receipt download and print buttons. A confirmation email goes to the parent and to the academy.
6. On failure or expiry it shows a red "Payment Failed." with a Try again button.

One function, `markPaid`, is the only thing that can mark an order paid. Both the poller and the webhook call it, and it only accepts the exact amount that was requested. If both arrive at once, only one sends the emails.

## Webhooks
The poll only runs while the customer's browser is open. If they close the tab right after paying, nothing confirms the order. The webhook is Razorpay calling [api/razorpay-webhook.ts](api/razorpay-webhook.ts) itself when money lands, with no browser involved. The poll stays on as a backup in live mode.

- **Secret:** `RAZORPAY_WEBHOOK_SECRET` is a password you invent. You type it into the Razorpay dashboard and into your env. Razorpay signs every call with it, and the route rejects any request whose signature doesn't match.
- **Raw body:** the signature covers the exact bytes Razorpay sent, so the route turns off body parsing.
- **Duplicates:** Razorpay can deliver the same event more than once, so each event ID is logged in `payment_webhook_events` and repeats are acknowledged and skipped.

## Next steps
1. **Now (test mode):** add the three `RAZORPAY_*` values, and `ALLOW_PAYMENT_SIMULATION=true` for local testing, which adds "Simulate success/failure" buttons. They only work with `rzp_test_` keys. Run `npm run dev`; `/api/*` now works locally through a small dev middleware I added to [vite.config.ts](vite.config.ts).
2. **After KYC:** swap in the live keys and add the Firestore credentials on Vercel (`FIREBASE_SERVICE_ACCOUNT`).
3. **Webhook:** register `https://<your-domain>/api/razorpay-webhook` in the dashboard with your secret and the events `qr_code.credited` and `qr_code.closed`.

The full checklist is in [PAYMENTS.md](PAYMENTS.md), and [.env.example](.env.example) lists every variable name.

## Open risks
- **UPI QR may not be enabled.** Razorpay's docs say it must be activated by their Support, and they don't say whether it works in test mode. If `create-payment` errors, ask Support to enable it.
- **Emails:** `onboarding@resend.dev` only delivers to the Resend account owner. Parents won't get emails until you verify a domain and set `EMAIL_FROM`.
- **Failed payments:** these are detected by polling Razorpay, not by webhook, because Razorpay's failure events don't say which QR they belong to.

## Choices I made from the brief
- **Early-bird deadline and workshop dates are placeholders** in `shared/pricing.ts` (31 Dec 2026, and four dates between Dec 2026 and Feb 2027). Please give me the real ones.
- **Instalments:** the brief ends before listing any plan, so I showed only the ₹1,50,000 fee and a "contact us" note. The code has an empty slot for plans.
- **Craft Your Own Story:** I kept it at 21 days, since the name says so, while the other courses are 7 days. Tell me if you want 7.
- **Yearly Package:** I read "replace the two programme options" as the registration form's programme field, which is now fixed to the Yearly Package. The other two packages are bought from the new pricing section.
- **Game:** the nav item links to a "Coming soon" page.
- **Passion Projects:** I replaced the placeholder four levels with your six, and removed the "Assessment & Progression" block, since it described those four.
- **CC Club:** the path image, the weekly offline meeting and the five levels are on the `/club` landing page. The image has dark line art, so it sits on a light panel inside the dark theme.
- **Leadership Lab Forward image:** I couldn't get an open-source photo, as Unsplash blocks automated access and the Wikimedia results were poor. It shows a neumorphic skill-tile design instead. Drop a licensed photo at `public/images/llf-hero.jpg` and it's used automatically.
- **Kids course images:** the new courses reuse existing images.
- **DaySchedule:** it's a scheduling tool, so little carries over. I borrowed side-by-side tiers and a clear refund policy. A refund policy is still worth adding. I didn't copy its countdown banner, because the early-bird deadline isn't real yet.

I haven't committed anything. The build also regenerated `public/sitemap.xml`, now including `/game`.




## 1. Webhook URL

No. Razorpay doesn't want a domain. It wants the full URL of the endpoint it should call:

```
https://www.theconsistentacademy.in/api/razorpay-webhook
```

The homepage URL would hit your React app, which would answer with the HTML page and never process anything. In Dashboard → Account & Settings → Webhooks → Add New Webhook, enter:

| Field | Value |
|---|---|
| Webhook URL | `https://www.theconsistentacademy.in/api/razorpay-webhook` |
| Secret | The same value as `RAZORPAY_WEBHOOK_SECRET` in Vercel (you invent it; use 20+ random characters) |
| Events | `qr_code.credited` and `qr_code.closed` only |

- **Use the exact host your site serves.** If `theconsistentacademy.in` redirects to `www.`, point the webhook at the final `www.` URL. Razorpay doesn't follow redirects reliably, and a 301 counts as a failed delivery.
- **Test and live are separate.** Register the webhook once while in Test Mode, with the test secret, and again in Live Mode after KYC. Each mode has its own secret, so the live `RAZORPAY_WEBHOOK_SECRET` can differ.
- **Localhost won't work.** Razorpay can't call it. To test locally, use a tunnel such as `ngrok http 8080` and register the tunnel URL on the test webhook. Or skip webhooks in test mode, because the polling path already settles orders without them.
- **Check it works.** Dashboard → Webhooks → your webhook shows delivery attempts and response codes. 200 means success. 400 means the secret doesn't match. 503 means `RAZORPAY_WEBHOOK_SECRET` is missing in Vercel. Vercel env changes need a redeploy before they take effect.

## 2. The email system

### How email works today

All mail goes through Resend, called from the server routes in `api/`. A project at one end of the pipe:

| Route | To the academy | To the user |
|---|---|---|
| `contact.ts` | Yes, with `replyTo` set to the sender | No acknowledgement |
| `lbfp-enquiry.ts` | Yes, with `replyTo` | Yes, an auto-acknowledgement |
| `webinar-registration.ts` | Yes, with `replyTo` | Yes, a confirmation |
| `payments.ts` (new) | Yes | Yes, a receipt |

Three things limit this today:

1. **The sender is `onboarding@resend.dev`.** That is Resend's sandbox address. It can only deliver to the email address that owns the Resend account, so almost no parent receives anything right now. This is the main blocker.
2. **Every reply is one-way.** `replyTo: email` means that when you press Reply in Gmail, your answer goes to the user. It works, but only by hand, from the shared Gmail inbox. When the user replies to the confirmation we send them, it goes to `onboarding@resend.dev`, which nobody monitors, so the reply is lost.
3. **Nothing is tracked.** There's no record of which emails were sent, delivered or bounced, and no list of enquiries awaiting an answer.

### The target

You described three behaviours:
- A user who submits a query gets an automatic acknowledgement.
- Registration, payment and enrolment each get their own confirmation.
- The academy can answer a query and have that answer reach the user.

Those split into three levels, which you can build in order.

### Level 1: automatic confirmations (mostly built)

This level needs no new tooling beyond the domain setup below.

**External steps**
1. **Verify your domain in Resend.** Resend dashboard → Domains → Add Domain → `theconsistentacademy.in`. Resend shows 3–4 DNS records: an SPF record, a DKIM key, and an MX record for the `send.` subdomain. Add them at whoever hosts your DNS (the registrar, or Cloudflare or similar). Verification usually takes minutes, sometimes up to a few hours.
2. **Add a DMARC record yourself.** Add a TXT record at `_dmarc.theconsistentacademy.in` with `v=DMARC1; p=none; rua=mailto:theconsistentacademy@gmail.com`. Without SPF, DKIM and DMARC, Gmail and Outlook will send your mail to spam. Start with `p=none` to monitor, and tighten it later.
3. **Pick sender addresses.** For example `no-reply@` for receipts and `hello@` or `admissions@` for conversational mail. Don't use `no-reply@` anywhere you expect replies.
4. **Check the Resend plan.** The free tier allows 100 emails a day and 3,000 a month. That's enough to start, but a batch of school registrations could hit the daily cap. Paid plans start at $20 a month.

**Codebase changes**
1. **Add a shared email module**, `api/_lib/email.ts`, with one `sendMail()` function. It holds the verified `from` address, a standard header and footer, and the neumorphic-styled HTML template. Every route then calls this instead of building HTML inline. This also fixes the escaping gap: `contact.ts` and `lbfp-enquiry.ts` currently put user text straight into HTML, which should be escaped.
2. **Set `EMAIL_FROM`** in Vercel to the verified address. Payments already read it. Update `contact.ts`, `lbfp-enquiry.ts` and `webinar-registration.ts` to use it too.
3. **Add the missing acknowledgement to `contact.ts`.** It's the only route that doesn't reply to the sender.
4. **Add an enrolment email.** The receipt email we send today says payment was received. Add a second template for "you're enrolled", sent once the academy confirms the cohort or date. This can be triggered from the admin dashboard (see Level 3).
5. **Record the outcome of every send** in Firestore (`emailLog`: template, recipient, status, Resend message ID, timestamp). `payments` already stores `emailStatus`, and this extends the same idea. Right now a failed send is only logged to the console.
6. **Set `replyTo` on every email to the user** to your real support inbox (for example `theconsistentacademy@gmail.com`). That way, when a parent replies to any automatic email, it reaches a human and not a dead address.

At the end of Level 1, every form submission and payment produces a proper branded confirmation to the user, and a notification to you.

### Level 2: replies into one inbox (the "answer reaches the user" path)

Today you answer manually from Gmail. That works at low volume, and it's reasonable to stay here at first. When it stops scaling, you have three options.

**Option A, Gmail as the help desk.** Create `hello@theconsistentacademy.in` on Google Workspace (about ₹125–200 per user per month) and use it as both the sender and the reply-to address. Staff answer from Gmail, and threads stay visible to anyone sharing the inbox. This is the lowest effort and a good default.

**Option B, replies handled in the admin dashboard.** You build an inbox view in `AdminDashboard.tsx` that lists enquiries from `contact`, `lbfpEnquiries` and webinar registrations. Each row has a Reply box, and sending it calls a new route, `api/admin-reply.ts`, which emails the user through Resend and logs it against the enquiry. The route must check the caller's Firebase ID token and confirm they're an admin, or anyone could send mail as the academy. The limitation is that incoming replies still land in Gmail, so you either keep two places in sync or add Option C.

**Option C, inbound email parsing.** Resend can receive mail on your domain and forward it to a webhook. You'd add an MX record for a subdomain such as `reply.theconsistentacademy.in`, then use per-enquiry reply addresses like `enq-8f3k2@reply.theconsistentacademy.in`. Resend posts the incoming message to `api/inbound-email.ts`, which finds the enquiry from the address and stores the reply in the dashboard. Replies and answers then live in one thread. This is the most complete option and also the most work. Check Resend's current inbound-email support and plan limits before committing, since I haven't verified them.

My recommendation is **Level 1 plus Option A now**, and Option B or C only once volume justifies it.

### Level 3: payment-triggered and lifecycle emails

These hang off events you already track:

| Trigger | Email | Status |
|---|---|---|
| Enquiry submitted | Acknowledgement | `lbfp` and webinar done, `contact` missing |
| Payment paid | Receipt and confirmation | Built |
| Payment failed or expired | "Your payment didn't go through, retry here" with a link | Not built |
| Admin marks an order enrolled | Enrolment confirmation with date, mode and joining details | Not built |
| Cohort date approaching | Reminder with joining link or venue | Not built |

For the failed-payment email, add a call in `markFailed` in `api/_lib/payments.ts`. For enrolment and reminders, add an Enrol action on the admin payments view (which doesn't exist yet) and a scheduled job. Vercel Cron can call a route such as `api/send-reminders.ts` daily, and `vercel.json` would define the schedule.

### Cross-cutting concerns

- **Spam and abuse.** `contact.ts` and the enquiry routes are public. Anyone can post to them, and each post now sends an email. Add basic rate limiting, a honeypot field, or a captcha such as Cloudflare Turnstile before this level of automation.
- **Email injection.** User text must be HTML-escaped before it goes into a template. The payment route already does this; the older routes don't.
- **Consent and privacy.** These are transactional emails, which don't need an unsubscribe link. If you later send promotional mail, you need unsubscribe handling. You're also collecting children's details, so a short privacy note on the forms is worth having.
- **Bounces and complaints.** Resend can post a webhook when an email bounces or is marked as spam. A small `api/resend-webhook.ts` could flag those addresses in Firestore, so you notice when a parent never received their receipt.

### Suggested order

1. Verify the domain in Resend and set `EMAIL_FROM` (about an hour, mostly waiting on DNS).
2. Build `api/_lib/email.ts` with a shared template, and set `replyTo` on every user-facing email.
3. Add the `contact.ts` acknowledgement and the failed-payment email.
4. Add the `emailLog` collection.
5. Move your daily replying to a Workspace shared inbox.
6. Only later, add the admin reply panel, then inbound parsing if you need it.

I can start on steps 2–4 whenever you want. They're all code changes I can make now, and the only external prerequisite is the verified domain.