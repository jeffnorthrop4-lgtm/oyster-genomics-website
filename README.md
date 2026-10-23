# Oyster Genomics

OG's website: genetic infrastructure for aquaculture.

## Structure

- `dist/index.html` — website content and metadata
- `dist/styles.css` — responsive styling
- `dist/app.js` — navigation and accessibility behavior
- `dist/assets/` — locally served imagery and favicon
- `netlify.toml` — deployment settings

## Local preview

Run `python3 -m http.server 8080 --directory dist` and open `http://localhost:8080`.

## Deployment

Netlify publishes `dist` from the `main` branch. This is a static site with no build command and no package dependencies. Pushes to `main` deploy automatically after Git integration is connected.

Netlify's local `.netlify` state and environment files are ignored by Git.

## Editorial notes

The hero image is generated illustrative brand artwork of an Eastern oyster. Company progress is based on supplied company materials; research goals and commercial targets are labeled accordingly. Target genes and identifying mechanisms are intentionally omitted from the source.
