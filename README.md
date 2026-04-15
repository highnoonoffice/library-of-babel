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

## The math

The Library contains 10^4677 books. Each book: 410 pages, 40 lines, 80 characters per
line. 25-symbol character set. Every possible combination exists exactly once.

Addresses are base-36 encoded, 28 characters long. Fully deterministic — same input,
same address, any machine, any session, any century.

## Stack

TypeScript · Next.js · OpenClaw MCP skill integration

---

Built by [High Noon Office](https://josephvoelbel.com)
