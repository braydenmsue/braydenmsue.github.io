# braydenmsue.github.io

Personal website for Brayden Sue, built with [Astro](https://astro.build) and Tailwind CSS.

## Development

Node is pinned via [Volta](https://volta.sh) (see `package.json`).

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run check     # type-check .astro/.ts files
```

## Layout

- `src/site.ts` — name, bio, socials, experience, education, skills
- `content/posts/*.md` — blog posts (`title`, `date`, `summary`)
- `content/projects/*.md` — projects (see `sample-project.md`); frontmatter is validated by `src/content.config.ts`
- `src/pages/` — routes; `src/components/` and `src/layouts/` — shared UI
- `public/` — served as-is (put `resume.pdf` and project images here)

## Spotify

The homepage's "Currently Listening To" is fetched at build time (`src/lib/spotify.ts`).
Copy `.env.example` to `.env`, fill in your client ID/secret, then run `npm run spotify-token`
once to get a refresh token. Add all three values as GitHub Actions secrets.

## Deploy

`.github/workflows/deploy.yml` builds on every push to `main` and daily (to refresh Spotify data),
then publishes `dist/` to the `gh-pages` branch.
