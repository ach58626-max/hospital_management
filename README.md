# MediCare – Hospital Management (front-end only)

A responsive hospital dashboard built with HTML, CSS, JavaScript and React 18. No backend, no database.

## Run it
Open `index.html` in a browser (internet needed, React loads from a CDN). To deploy, upload this folder to Vercel as a static site.

## Features
- Mock role-based login (Admin, Doctor, Receptionist) with protected pages
- Dashboard: summary cards, two charts, upcoming appointments
- Patients: search, filter, pagination, add / edit / delete, assigned doctor, detail page
- Doctors: add / edit / remove (Admin), profile page with patients under care, patient counts, availability, specialty filter and search
- Appointments: book, reschedule, cancel, status changes
- Billing: create invoice, paid / unpaid, printable invoice
- Dark mode (follows system), toast messages, mobile layout

## Tech stack
React 18 + htm (JSX-style templates, no build step), plain CSS, localStorage for persistence. All data is fake (`data.js`).

## Roles
Admin: all pages. Doctor: no billing, read-only patients. Receptionist: sees doctors (read-only), no add or edit.

## What I would improve next
Calendar view, CSV/PDF export, ward and bed tracker, unit tests, Next.js + Tailwind version, form validation with React Hook Form + Zod.
