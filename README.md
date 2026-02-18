# Scarlet Buscas — Static Site

This is a themed static website for *Scarlet Buscas*. Open `index.html` in your browser to view it locally.

Quick start:

```powershell
# from this folder
start .\index.html  # Windows
```

Run the bundled PowerShell server (no Python/Node required):

```powershell
cd path\to\simple-website
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8000
# then open http://localhost:8000
```

Files:
- `index.html` — main page
- `styles.css` — themed styles
- `script.js` — interactions (mobile nav, smooth scroll)
- `assets/logo.svg` — placeholder Scarlet Buscas logo

You can deploy this folder to any static host (Netlify, GitHub Pages, Vercel).

Helpful next steps
- Configure the contact form: sign up at Formspree and replace `YOUR_ID` in the form `action` in `index.html`.
- To minify assets locally (requires Node):

```bash
cd path/to/simple-website
npm install
npm run minify
```

- **Auto-deploy to GitHub Pages** (recommended):
  1. Create a repository on GitHub (e.g., `username/scarlet-buscas-site`).
  2. Clone or init locally and push this code:
     ```bash
     git init
     git add .
     git commit -m "Initial Scarlet Buscas site"
     git branch -M main
     git remote add origin https://github.com/USERNAME/scarlet-buscas-site.git
     git push -u origin main
     ```
  3. GitHub Actions will automatically build and deploy to `gh-pages` branch.
  4. In your repo **Settings** → **Pages**, select `gh-pages` branch and `/root` folder.
  5. Your site will be live at `https://USERNAME.github.io/scarlet-buscas-site/` in ~2 min.

- **Manual deploy** (if you prefer):
  ```bash
  npm install
  npm run deploy
  ```

- To enable analytics: paste your GA4 `G-MEASUREMENT_ID` into the GA snippet in `index.html`.


Run a local server (PowerShell, no Python/Node needed):

```powershell
cd path\to\simple-website
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -Port 8000
# then open http://localhost:8000
```

Or use Python / Node if available:

```bash
# Python 3
python -m http.server 8000

# Node (npx serve)
npx serve . -l 5000
```
