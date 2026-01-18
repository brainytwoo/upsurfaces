# UP Surfaces Website

Source code for **upsurfaces.com**, the official website for UP Surfaces — a metal roofing company based in Michigan’s Upper Peninsula.

Built to be fast, simple, and reliable.

---

## Overview

- Static, performance-focused website
- Designed for a local service business
- Mobile-first and easy to maintain
- Deployed on Netlify

---

## Tech Stack

- HTML
- Tailwind CSS (compiled to `output.css`)
- Vanilla JavaScript
- Netlify (hosting, forms, and security headers)

---

## Key Features

- Fully responsive layout
- Standing seam metal roofing service pages
- Repair and accessory sections
- Netlify Forms contact form with reCAPTCHA
- Toast notifications for form feedback
- Strong security headers
- Minimal JavaScript, no frameworks

---

## Project Structure

```
/
├─ src/
│  ├─ input.css
│  ├─ output.css
│  ├─ logic.js
│
├─ images/
├─ index.html
├─ netlify.toml
```
---

## Local Development

Build Tailwind CSS:

```bash
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch
```

Open `index.html` in your browser.

---

## Deployment

- Automatically built and deployed via Netlify
- Tailwind compiled and minified during build
- Security headers applied at the CDN level

---

## Notes

This project is intentionally framework-free.  
No React, no heavy build tooling — just fast, predictable HTML, CSS, and JavaScript.

---

## License

Private project.  
Not licensed for reuse or redistribution.
