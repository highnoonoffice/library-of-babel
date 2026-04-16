# Library of Babel

> "The Library exists ab aeterno." — Jorge Luis Borges

Every piece of text that has ever been written — or ever could be written — exists
somewhere in Borges' infinite Library. This tool finds it.

A deterministic coordinate system for the Library of Babel. Give it any text and it
returns a permanent hexagon address. Give it an address and it returns the exact page
that lives there. No randomness. No database. Same input always produces identical output.

## What it does

- **Find** — Locate any text: hexagon, wall, shelf, volume, page
- **Read** — Navigate to any coordinate and read the exact 3,200-character page
- **Catalog** — Save permanent addresses and revisit them
- **Explore** — Page through volumes with Prev/Next navigation

## Features

- Page navigation: Prev/Next through all 410 pages of each volume.
- Leather book spine textures (optional — 4 images in `public/textures/`).
- Deterministic text placement — same text always highlighted at the same position on its home page.
- In-session address book — search text carries from Find → Explore, highlight persists across navigation.

## The math

The Library contains 10^4677 books. Each book: 410 pages, 40 lines, 80 characters per
line. 25-symbol character set. Every possible combination exists exactly once.

Addresses are base-36 encoded, 28 characters long. Fully deterministic — same input,
same address, any machine, any session, any century.

## Installation

```bash
npm install
npm run dev
```

## Textures (Optional)

The Explore view renders photorealistic leather-bound book spines when 4 texture images are present at `public/textures/` in your Next.js app:

- `leather-oxblood.png`
- `leather-navy.png`
- `leather-green.png`
- `leather-tobacco.png`

Without these files the component renders a CSS gold gradient fallback for selected volumes. No errors, no broken state.

## Build / Deploy

```bash
npm run build
npm run start
```

Built by [High Noon Office](https://josephvoelbel.com)
