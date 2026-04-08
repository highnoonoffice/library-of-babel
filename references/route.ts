import { NextResponse } from 'next/server';

const ALPHABET = "abcdefghijklmnopqrstuvwxyz ,."; // 29 chars
const BASE = 29n;
const PAGE_LEN = 3200;

// ——— Artifact fragments: coherent prose buried in the noise ———
// Surfaces 1-in-12 pages. Feels like a found poem, a lost thing washed ashore.
const ARTIFACTS = [
  "i have been here before i think in a dream or perhaps in some other life i cannot say",
  "the light was gold and long and the afternoon refused to end",
  "she said my name once and i have been trying to forget the sound of it ever since",
  "there is a word in no language for the feeling of arriving somewhere you have never left",
  "pay attention to what you return to that is the thing",
  "all rivers know what the ocean knows and say nothing",
  "he carried the map for thirty years before he understood that he was the territory",
  "the library contains every book including the one you meant to write",
  "forgetting is not the opposite of memory it is memory turned inside out",
  "somewhere in this building there is a room with your name on it and the door is always open",
  "i am writing this for someone who will find it by accident and know it was meant for them",
  "the silence between two people who have said everything is not empty",
  "attention is the rarest form of love simone weil said and she was right",
  "the version of you that did not make that choice is also reading this somewhere",
  "every book begins with someone deciding the silence was not enough",
  "you came back to this page because you already knew the answer",
  "the hardest thing is to hold two true things at once without turning them into one",
  "what we call an ending is only a door the story found and walked through",
  "i wrote your name in a language i invented and it was the most honest thing i ever said",
  "to be lost is to have arrived somewhere the map did not expect",
];

function normalizeToAlphabet(text: string): string {
  return text.toLowerCase().split('').filter(c => ALPHABET.includes(c)).join('');
}

function seededInt(seed: bigint, max: number): number {
  // Simple deterministic hash from seed → [0, max)
  const s = (seed ^ (seed >> 33n)) * 0xff51afd7ed558ccdn;
  const t = (s ^ (s >> 33n)) * 0xc4ceb9fe1a85ec53n;
  const u = t ^ (t >> 33n);
  return Number(((u % BigInt(max)) + BigInt(max)) % BigInt(max));
}

function generatePageContent(globalIndex: bigint): { raw: string; artifact: string | null; artifactOffset: number } {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createHash } = require('crypto');

  // Determine if this page has an artifact (1 in 12)
  const artifactCheck = seededInt(globalIndex * 7919n + 31337n, 12);
  const hasArtifact = artifactCheck === 0;
  const artifact = hasArtifact ? ARTIFACTS[seededInt(globalIndex * 1301n, ARTIFACTS.length)] : null;

  let raw = '';
  let chunkIndex = 0n;
  while (raw.length < PAGE_LEN) {
    const input = `${globalIndex.toString()}-${chunkIndex.toString()}`;
    const hash = createHash('sha256').update(input).digest() as Buffer;
    for (let i = 0; i < hash.length && raw.length < PAGE_LEN; i++) {
      raw += ALPHABET[hash[i] % 29];
    }
    chunkIndex++;
  }

  let artifactOffset = -1;
  if (artifact) {
    const normalized = normalizeToAlphabet(artifact);
    // Place it somewhere in the middle third, deterministically
    artifactOffset = seededInt(globalIndex * 997n, PAGE_LEN / 3) + PAGE_LEN / 3;
    raw = raw.slice(0, artifactOffset) + normalized + raw.slice(artifactOffset + normalized.length);
  }

  return { raw, artifact, artifactOffset };
}

function formatPage(raw: string, highlightIn: { start: number; end: number } | null): {
  page: string;
  highlight: { start: number; end: number } | null;
} {
  let out = '';
  let highlightStart = -1;
  let highlightEnd   = -1;

  for (let i = 0; i < raw.length; i++) {
    if (highlightIn && i === highlightIn.start) highlightStart = out.length;
    out += raw[i];
    if (highlightIn && i === highlightIn.end - 1) highlightEnd = out.length;
    if ((i + 1) % 400 === 0) out += '\n\n';
  }

  return {
    page: out.trim(),
    highlight: highlightStart >= 0 ? { start: highlightStart, end: highlightEnd } : null,
  };
}

// text → coordinates
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const { text } = body;
  if (typeof text !== 'string') {
    return NextResponse.json({ error: 'Missing text string' }, { status: 400 });
  }

  let index = 0n;
  for (const ch of text.toLowerCase()) {
    const pos = ALPHABET.indexOf(ch);
    if (pos === -1) continue;
    index = index * BASE + BigInt(pos);
  }

  const volume  = Number(index % 32n);
  const shelf   = Number((index / 32n) % 5n);
  const wall    = Number((index / 160n) % 4n);
  const hexagon = (index / 640n).toString();
  const global_index_preview = hexagon.length > 15 ? `${hexagon.slice(0, 15)}...` : hexagon;

  return NextResponse.json({ hexagon, wall: wall + 1, shelf: shelf + 1, volume: volume + 1, global_index_preview });
}

// coordinates → page content
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hexagon    = searchParams.get('hexagon') || '0';
  const wall       = BigInt(Math.max(1, parseInt(searchParams.get('wall')   || '1', 10)) - 1);
  const shelf      = BigInt(Math.max(1, parseInt(searchParams.get('shelf')  || '1', 10)) - 1);
  const volume     = BigInt(Math.max(1, parseInt(searchParams.get('volume') || '1', 10)) - 1);
  const searchText = searchParams.get('text') || '';

  try {
    const hexBig      = BigInt(hexagon);
    const globalIndex = hexBig * 640n + wall * 160n + shelf * 32n + volume;

    const { raw, artifact, artifactOffset } = generatePageContent(globalIndex);

    // If user searched for text, embed it at offset 80 (overrides artifact zone)
    let finalRaw = raw;
    let embedHighlight: { start: number; end: number } | null = null;

    if (searchText) {
      const normalized = normalizeToAlphabet(searchText);
      if (normalized.length > 0 && normalized.length < PAGE_LEN) {
        const offset = 80;
        finalRaw = finalRaw.slice(0, offset) + normalized + finalRaw.slice(offset + normalized.length);
        embedHighlight = { start: offset, end: offset + normalized.length };
      }
    }

    // If no search text, surface artifact highlight if present
    const rawHighlight = embedHighlight ?? (
      artifact && artifactOffset >= 0
        ? { start: artifactOffset, end: artifactOffset + normalizeToAlphabet(artifact).length }
        : null
    );

    const { page, highlight } = formatPage(finalRaw, rawHighlight);

    return NextResponse.json({
      page,
      highlight,
      artifact: !searchText ? artifact : null,   // signal to client that this is a found artifact
      isArtifact: !searchText && artifact !== null,
      globalIndex: globalIndex.toString().slice(0, 20) + '...',
    });
  } catch {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }
}
