# Carl Angelo Maniangap — Portfolio

The original portfolio experience migrated to Next.js 16. The visual language, content, accessibility work, and interactive features from the working static portfolio are preserved instead of being redesigned.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
app/
  globals.css      Original visual system plus the profile-photo treatment
  layout.tsx       Metadata, fonts, icons, manifest, and theme bootstrap
  page.tsx         Small Next.js route adapter
features/portfolio/
  content.ts       Server-side template preparation and personal additions
  template.html    Preserved semantic portfolio markup
public/
  portfolio.js     Existing interactions and progressive enhancements
  github-activity.js  Recent public GitHub contribution activity
  profile.jpg      Profile portrait
  resume.pdf       Public résumé
  sw.js            Offline support updated for Next.js routes
```

## Preserved features

- Responsive navigation, side navigation, and mobile bottom bar
- Project category and tag filters
- Project detail dialogs and shareable project hashes
- Animated hero network, connected-tool explanations, and typing effect
- Interactive app map and seven workflow simulations
- Command menu and keyboard shortcuts
- Dark, light, and system themes
- Text-size and reduced-motion preferences
- At-a-glance summary and recruiter view
- Résumé preview and download
- GitHub repository feed and recent public contribution activity
- Manila time, vCard download, native sharing, and copy-email feedback
- Contact validation, local draft restoration, and character count
- Installable/offline PWA behavior

## Checks

```bash
pnpm lint
pnpm build
```

Before publishing, confirm the September 2025 employment start month and LinkedIn URL. Add `metadataBase` in `app/layout.tsx` once the final domain is known.
