# UP Surfaces — Website

Static, single-page marketing site built with **Tailwind CSS** (precompiled), **Netlify Forms**, and a small JS file for UI (toast + form submit/disable).

## Project Structure
```
/
├─ index.html         # Single-page site
├─ netlify.toml       # Netlify config (headers, build, etc.)
/ images              # Images, Logos, etc
/ src
  ├─ styles.css       # Compiled Tailwind CSS (no CDN)
  └─ logic.js         # Toast + Netlify form submit & button state
```

## Local Development
You don’t need Node to view the site — just open `index.html` in a browser.
For a nicer local server (SPA routing, CORS-safe), run one of:

```bash
# Python 3
python3 -m http.server 8080

# or Node (if installed)
npx serve .
```
Then visit `http://localhost:8080`.

## Tailwind (Production-First)
The site uses the **compiled** stylesheet `styles.css`.  
If you ever want to change or rebuild Tailwind from source, add a `src/input.css` and run the CLI:

```bash
# Initialize once
npm init -y
npm install -D tailwindcss
npx tailwindcss init

# Example build command
npx tailwindcss -i ./src/input.css -o ./src/styles.css --minify
```

> The current repo is ready to deploy without a Node build step; `styles.css` is already minified.

## Deploying to Netlify
1. Create a new site on Netlify and connect a repo or **drag-and-drop** index.html, netlify.toml, /images ( all images ), /src ( styles.css, logic.js )
2. Ensure the **Publish directory** is the project root (since `index.html` is at `/`).  
3. Netlify will read `netlify.toml` for security headers.

### Custom Domain
- Add `upsurfaces.com` in **Site settings → Domain management**, and update DNS to point at Netlify.

## Contact Form (Netlify Forms)
- The form in `index.html` is configured for **Netlify Forms** (no server needed).
- `logic.js` handles:
  - Preventing multiple submissions (disable + “Sending…” → “Complete”)
  - Submitting via `fetch` to `/`
  - Showing a success/error **toast** (no redirect)

### Email Notifications
After first deploy and a test submission:
1. Go to **Netlify → Forms → contact**.
2. **Notifications → Add notification → Email**.
3. Enter your Workspace address (e.g. `contact@upsurfaces.com` or `info@upsurfaces.com`).

### Spam Protection
- A honeypot field is included.
- Optionally enable **reCAPTCHA** in Netlify and add:
  ```html
  <div data-netlify-recaptcha="true"></div>
  ```
  above the submit button.

## Editing Site Content
All content is in `index.html`. Common edits:
- **Services/steps/pricing**: update the relevant sections and copy.
- **Logos & images**: replace file paths used in hero/gallery.
- **Footer contact**: update phone/email once, links auto-work.

## Performance Tips
- Use the web-optimized images we generated (e.g., `*-small.jpg`, `*-medium.jpg`, `*-large.jpg`).
- Prefer `<img loading="lazy">` for below-the-fold images.
- Keep `styles.css` as the single minified stylesheet.

## Accessibility
- Provide meaningful `alt` text on all images.
- Maintain sufficient color contrast (current palette passes typical checks).
- Ensure button text is descriptive (“Get a quote”, “Send request”, etc.).

## Troubleshooting
- **Form not appearing in Netlify → Forms**:  
  - Ensure the form has `name="contact"`, `data-netlify="true"`, and the hidden `form-name` input matches.  
  - Make at least **one live submission** after deploy to register the form.
- **No email after submit**:  
  - Add a Netlify form notification to your Workspace address.  
  - Check spam/filters in Gmail and Netlify activity log.
- **Button stays disabled**:  
  - Check `logic.js` for errors in the browser console; the error path re-enables the button.

## License
Private/commercial — UP Surfaces. All rights reserved.
