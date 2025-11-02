# Energy Saving Teen — Landing (Vite + React + Tailwind)

This repository contains a scaffold for the Energy Saving Teen landing site implemented with:
- React + Vite
- Tailwind CSS (mobile-first)
- Simple components: Header, Hero, Features, Footer

## Local development

1. Install dependencies:
```bash
npm install
```

2. Run the dev server:
```bash
npm run dev
```

3. Build:
```bash
npm run build
```

4. Preview production build locally:
```bash
npm run preview
```

## Notes about the implementation
- Mobile-first Tailwind implementation. Desktop responsiveness is provided via breakpoints.
- Uses a placeholder app preview image. If you have exported SVG/PNG assets from the Figma file, place them in `public/` or `src/assets/` and update the `Hero` component image path.
- No backend or auth yet; structure allows adding API routes or integrating with services later.

## Render deployment instructions

To deploy this static site to Render as a Static Site:

1. Sign in to Render and create a new Static Site.
2. Connect your GitHub repository (choose `gang1103app/figmafigmaboi`).
3. In the Create Static Site settings:
   - **Name**: energy-teen-landing (or your preferred name)
   - **Branch**: `1.0` (or main once merged)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click "Create" — Render will install, build, and publish your site.
5. (Optional) Enable automatic deploys to rebuild on PR merges to the branch.

## PR template / description (ready to paste)

**Title:**
feat: scaffold React + Vite + Tailwind and implement mobile-first landing (from Figma)

**Description:**
- Scaffolds a Vite + React project and integrates Tailwind CSS.
- Implements a mobile-first landing page (Header, Hero, Features, Footer) based on the Figma prototype.
- Placeholder app preview used (replace with exported assets from Figma/images).
- No backend/auth implemented yet.

Design source: `Energy-Saving Teen App Prototype.make` (repo root)

What to review:
- Responsiveness and visual parity with Figma for the landing screens.
- Tailwind usage & accessibility.

Next steps:
- Replace the placeholder mockups with exported Figma assets (SVGs preferred).
- Add onboarding / signup pages and any required backend endpoints.
- Set up CI / staging & configure Render auto-deploy.
