UP Surfaces Website

This repository contains the source code for upsurfaces.com, the official website for UP Surfaces, a metal roofing business based in Michigan’s Upper Peninsula.

The site is designed to be fast, simple, and dependable—just like the work it represents.

Overview

Static, performance-focused website

Built specifically for a small local service business

Mobile-first and easy to maintain

Deployed on Netlify

The site showcases services, pricing expectations, FAQs, and includes a contact form for quote requests.

Tech Stack

HTML – Clean, semantic structure

Tailwind CSS – Utility-first styling, compiled and minified

Vanilla JavaScript – Lightweight UI logic (menu, form handling, toasts)

Netlify – Hosting, builds, security headers, and form handling

No frameworks. No bloat.

Key Features

Responsive layout (desktop, tablet, mobile)

Standing seam roofing service pages

Repair and accessory sections

Netlify Forms contact form with reCAPTCHA

Toast notifications for form feedback

Strong security headers via Netlify

Optimized images and minimal JS

Project Structure
/
├─ src/
│  ├─ input.css        # Tailwind input
│  ├─ output.css       # Compiled Tailwind output
│  ├─ logic.js         # UI + form logic
│
├─ images/             # Site images & logos
├─ index.html          # Main site file
├─ netlify.toml        # Netlify build & security config

Local Development

Install dependencies (Tailwind CLI)

Run Tailwind build:

npx tailwindcss -i ./src/input.css -o ./src/output.css --watch


Open index.html in a browser

Deployment

Automatically built and deployed via Netlify

Tailwind is compiled and minified during build

Security headers enforced at the CDN level

Notes

This repo is intentionally simple.
It’s meant to be reliable, easy to update, and fast—not a framework experiment.

License

Private project.
Not licensed for reuse or redistribution.
