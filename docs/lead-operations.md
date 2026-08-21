# Canary Cove Lead Operations

This document is the canonical operating procedure for website leads. It describes the handoff after the public site has successfully submitted a form; it does not change the form transport implemented by `/api/forms`.

## Source of truth

- Formspree is the intake transport and review inbox for website submissions.
- The **Canary Cove lead dashboard is the operational source of truth** for genuine leads.
- A successful Formspree submission is not, by itself, a completed lead handoff. The handoff is complete only after the dashboard record has been written and read back successfully.
- Do not use an email inbox, an analytics conversion, or a Formspree notification as a substitute for the dashboard record.

Current dashboard surfaces:

- Production: `https://canarycove-dash.vercel.app`
- Repository: `/Users/enzo/Projects/canarycove-dash`
- Curated lead data: `data/submissions.ts`
- Contact Formspree form: `xvzarybk`
- Booking Formspree form: `xqeqllek`

The dashboard is currently reconciled from Formspree into its curated data file and then deployed. A successful website submission does not update the production dashboard by itself.

## Required flow

For each new website/Formspree submission:

1. Review the submission and confirm it belongs to Canary Cove and is a genuine lead. Exclude spam, malformed submissions, clearly labeled tests, and non-lead system traffic.
2. Check for the same immutable Formspree submission ID before writing when that provider ID is available. Otherwise compare the source form, exact submission timestamp, and normalized email against the existing dashboard data. If the source row was already processed, reconcile the existing record instead of creating another one. Never deduplicate by name or email alone because a guest may submit a real follow-up.
3. Add or update the genuine booking/contact lead in the Canary Cove lead dashboard using the minimum information needed for follow-up. Preserve the form type/source (`booking` or `contact`) and a stable dashboard ID. Homepage `email_capture` rows are tracked separately and do not belong in this lead dashboard.
4. Read the dashboard record back after the write. Verify that the expected lead exists once, the source is correct, and the required contact/request fields match the reviewed submission.
5. Treat the ingest as incomplete if the dashboard write or readback cannot be verified. Record or report the blocker without emailing the lead details elsewhere.

## Notification policy

- **Do not email Consi directly as part of lead ingestion.**
- **Do not add Consi as a Formspree notification recipient or forward Formspree notifications to her.**
- Do not create a parallel email-based lead queue. Operational handling happens in the Canary Cove lead dashboard.
- If a future workflow needs an external notification or customer reply, stage the exact message and obtain action-time approval before sending. That is separate from routine lead ingestion.

## Privacy and duplicate safety

- Keep personal data out of logs, analytics events, commits, screenshots, task notes, and public documentation.
- Copy only the fields the dashboard requires for lead follow-up; do not duplicate free-form submission content into unrelated systems.
- Use the immutable Formspree submission ID as the primary deduplication key when available. Otherwise use the source form, exact submission timestamp, and normalized email. Do not use name or email alone.
- Re-running an ingest must be safe: update or skip an existing dashboard record rather than creating a duplicate.
- Do not submit a real public form merely to test this operating procedure. Use existing records or an approved, clearly labeled test only when a live end-to-end test is explicitly required.

## Booking path boundary

The public booking path remains request-based. Bookingmood was removed because its subscription was cancelled; do not restore it or add a replacement calendar workflow as part of lead handling.

## Completion checklist

A lead ingest is complete only when all of the following are true:

- the Formspree submission was reviewed and classified;
- a genuine lead was added to or reconciled in the Canary Cove lead dashboard;
- the source row was matched idempotently, using its Formspree submission ID when available or the documented source/timestamp/email fallback;
- the dashboard record was read back and verified with no duplicate;
- no direct email or Formspree notification was sent to Consi; and
- no sensitive lead data was exposed outside the approved intake and dashboard systems.
