'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ——— Palette ———
const PARCHMENT     = '#f0e6c8';
const PARCHMENT_AGE = '#d4c49a';
const INK           = '#1c1409';
const GOLD          = '#c8901c';
const GOLD_BRIGHT   = '#e8b040';
const GOLD_DIM      = '#7a5a18';
const FADED         = '#7a6040';
const WOOD_DARK     = '#1c1005';
const WOOD_MID      = '#2e1a08';
const WOOD_LIGHT    = '#5e320e';
const ARTIFACT_GLOW = '#f0d060';

// ——— Helpers ———
function toRoman(n: number): string {
  const vals = [50, 40, 10, 9, 5, 4, 1];
  const syms = ['L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  if (n <= 0 || n > 50) return String(n);
  let r = '', num = n;
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) { r += syms[i]; num -= vals[i]; }
  }
  return r;
}

function truncHex(h: string) {
  if (h.length <= 22) return h;
  return h.slice(0, 10) + '…' + h.slice(-6);
}

function randomHex(): string {
  return Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('').replace(/^0+/, '') || '1';
}

// ——— Typewriter hook ———
function useTypewriter(target: string, active: boolean, charsPerFrame = 6) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const frameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    if (!active || !target) { setDisplayed(''); setDone(false); posRef.current = 0; return; }
    setDisplayed('');
    setDone(false);
    posRef.current = 0;
    const initialDelay = setTimeout(() => {
      const tick = () => {
        posRef.current = Math.min(posRef.current + charsPerFrame, target.length);
        setDisplayed(target.slice(0, posRef.current));
        if (posRef.current < target.length) {
          frameRef.current = setTimeout(tick, 18);
        } else {
          setDone(true);
        }
      };
      tick();
    }, 600);
    return () => {
      clearTimeout(initialDelay);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [target, active, charsPerFrame]);

  return { displayed, done };
}

// ——— Book leather textures ———
const LEATHER = [
  { img: `/textures/leather-oxblood.png`,  pos: '20% center' },
  { img: `/textures/leather-navy.png`,     pos: '40% center' },
  { img: `/textures/leather-green.png`,    pos: '30% center' },
  { img: `/textures/leather-tobacco.png`,  pos: '50% center' },
  { img: `/textures/leather-oxblood.png`,  pos: '70% center' },
  { img: `/textures/leather-navy.png`,     pos: '60% center' },
  { img: `/textures/leather-green.png`,    pos: '10% center' },
  { img: `/textures/leather-tobacco.png`,  pos: '80% center' },
];

function BookSpine({ index, volumeNum, selected, visited, onClick }: {
  index: number; volumeNum: number; selected: boolean; visited: boolean; onClick: () => void;
}) {
  const leather = LEATHER[index % LEATHER.length];
  const heights = [108, 124, 116, 132, 104, 120, 128, 112, 136, 100, 118, 126];
  const height = heights[index % heights.length];
  const width  = selected ? 28 : 20 + (index % 4) * 2;

  return (
    <div
      onClick={onClick}
      title={`Volume ${toRoman(volumeNum)}`}
      style={{
        width, height,
        backgroundImage: selected
          ? `linear-gradient(90deg,#3a2a08 0%,#6b4e18 25%,#8a6620 45%,#7a5a18 65%,#3a2a08 100%)`
          : `url(${leather.img})`,
        backgroundSize: 'cover',
        backgroundPosition: leather.pos,
        borderRadius: '1px 2px 2px 1px',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease',
        boxShadow: selected
          ? `0 0 18px ${GOLD}55, 4px 0 12px rgba(0,0,0,0.9), inset 1px 0 0 ${GOLD}22`
          : `4px 0 10px rgba(0,0,0,0.85), inset -3px 0 10px rgba(0,0,0,0.5)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
        paddingTop: 10, paddingBottom: 10, position: 'relative',
        transform: selected ? 'translateY(-10px)' : 'none',
        border: selected ? `1px solid ${GOLD_DIM}77` : '1px solid rgba(0,0,0,0.6)',
        zIndex: selected ? 2 : 1,
        filter: visited && !selected
          ? 'brightness(0.78) saturate(0.65)'
          : selected
          ? 'brightness(1.15) saturate(0.9) contrast(1.05)'
          : `brightness(${0.82 + (index % 6) * 0.04}) saturate(0.72)`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: selected ? 'transparent' : 'rgba(0,0,0,0.38)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 8, left: 0, right: 0, height: 1, zIndex: 1, background: `linear-gradient(90deg,transparent,${GOLD_DIM}55,${GOLD_DIM}99,${GOLD_DIM}55,transparent)` }} />
      <div style={{ writingMode: 'vertical-rl', fontSize: 6.5, color: selected ? GOLD_BRIGHT : `${GOLD_DIM}cc`, letterSpacing: '0.12em', userSelect: 'none', fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontStyle: 'italic', marginTop: 12, fontWeight: 'bold', textShadow: selected ? `0 0 8px ${GOLD}` : '0 1px 2px rgba(0,0,0,0.9)', zIndex: 1, position: 'relative' }}>
        {toRoman(volumeNum)}
      </div>
      <div style={{ width: selected ? 6 : 4, height: selected ? 6 : 4, borderRadius: '50%', flexShrink: 0, zIndex: 1, position: 'relative', background: selected ? `radial-gradient(circle,${GOLD_BRIGHT} 0%,${GOLD} 100%)` : `radial-gradient(circle,${GOLD_DIM}99 0%,${GOLD_DIM}33 100%)`, boxShadow: selected ? `0 0 6px ${GOLD}` : 'none' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, height: 1, zIndex: 1, background: `linear-gradient(90deg,transparent,${GOLD_DIM}55,${GOLD_DIM}99,${GOLD_DIM}55,transparent)` }} />
    </div>
  );
}

function ShelfUnit({ shelfNum, selectedVol, visitedVols, onSelect }: {
  shelfNum: number; selectedVol: number | null; visitedVols: Set<string>; onSelect: (v: number) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 9, color: `${GOLD_DIM}cc`, marginBottom: 5, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', letterSpacing: '0.22em', textTransform: 'uppercase', fontStyle: 'italic' }}>
        Shelf {toRoman(shelfNum)}
      </div>
      <div style={{ background: `linear-gradient(180deg,${WOOD_MID} 0%,${WOOD_DARK} 80%,#080401 100%)`, borderRadius: 4, padding: '10px 12px 0', border: `1px solid ${WOOD_LIGHT}2a`, boxShadow: `inset 0 -6px 16px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.35)`, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', minHeight: 130 }}>
          {Array.from({ length: 32 }, (_, i) => {
            const volKey = `${shelfNum}-${i + 1}`;
            return (
              <BookSpine key={i} index={i + shelfNum * 5} volumeNum={i + 1} selected={selectedVol === i + 1} visited={visitedVols.has(volKey)} onClick={() => onSelect(i + 1)} />
            );
          })}
        </div>
        <div style={{ height: 9, background: `linear-gradient(180deg,${WOOD_LIGHT} 0%,${WOOD_MID} 50%,${WOOD_DARK} 100%)`, borderRadius: '0 0 4px 4px', marginTop: 4, boxShadow: '0 8px 16px rgba(0,0,0,0.7)' }} />
      </div>
    </div>
  );
}

function Descending() {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const msgs = ['The lantern swings in the dark','Corridors without end','A hexagon opens before you','The pages are turning','Dust. Silence. Then —'];
    let i = 0;
    const iv = setInterval(() => { i = (i + 1) % msgs.length; setDots(msgs[i]); }, 900);
    return () => clearInterval(iv);
  }, []);
  return <div style={{ color: FADED, fontStyle: 'italic', fontSize: 13, marginTop: 28, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', letterSpacing: '0.04em', minHeight: 22, animation: 'babelFade 1.2s ease-in-out infinite alternate' }}>{dots || 'Descending…'}</div>;
}

function CoordReveal({ coords, visible }: { coords: { hexagon: string; wall: number; shelf: number; volume: number }; visible: boolean }) {
  const [step, setStep] = useState(0);
  const items = [{ label: 'Hexagon', value: coords.hexagon },{ label: 'Wall', value: String(coords.wall) },{ label: 'Shelf', value: toRoman(coords.shelf) },{ label: 'Volume', value: toRoman(coords.volume) }];
  useEffect(() => {
    if (!visible) { setStep(0); return; }
    setStep(0);
    const timers = items.map((_, i) => setTimeout(() => setStep(s => Math.max(s, i + 1)), 300 + i * 320));
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, coords.hexagon]);
  const hexItem = items[0];
  const restItems = items.slice(1);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 20, opacity: step > 0 ? 1 : 0, transform: step > 0 ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
        <div style={{ fontSize: 9, color: FADED, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{hexItem.label}</div>
        <div style={{ fontSize: 11, color: PARCHMENT, fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6, userSelect: 'all', cursor: 'text', padding: '6px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 3, border: `1px solid ${GOLD_DIM}22` }}>{hexItem.value}</div>
        <div style={{ fontSize: 9, color: `${FADED}66`, marginTop: 4, fontStyle: 'italic' }}>click to select all</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {restItems.map(({ label, value }, i) => (
          <div key={label} style={{ textAlign: 'center', opacity: step > i + 1 ? 1 : 0, transform: step > i + 1 ? 'translateY(0)' : 'translateY(6px)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
            <div style={{ fontSize: 9, color: FADED, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 22, color: PARCHMENT, fontStyle: 'italic', lineHeight: 1.3 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface HighlightRange { start: number; end: number; }
interface PageData { page: string; highlight: HighlightRange | null; hex: string; wall: number; shelf: number; volume: number; pageNum: number; isArtifact?: boolean; artifact?: string | null; }

function PageDisplay({ page, highlight, hex, wall, shelf, volume, pageNum, isArtifact, typewrite = false }: PageData & { typewrite?: boolean }) {
  const { displayed, done } = useTypewriter(page, typewrite);
  const text = typewrite ? displayed : page;
  const showHighlight = typewrite ? done : true;
  const renderContent = () => {
    if (!highlight || !showHighlight) return <span>{text}</span>;
    const before = text.slice(0, highlight.start);
    const match  = text.slice(highlight.start, highlight.end);
    const after  = text.slice(highlight.end);
    return (<><span>{before}</span><mark style={{ background: isArtifact ? `${ARTIFACT_GLOW}44` : `${GOLD}55`, color: isArtifact ? '#2a1a00' : INK, borderRadius: 2, padding: '0 1px', boxShadow: isArtifact ? `0 0 16px ${ARTIFACT_GLOW}cc, 0 0 40px ${ARTIFACT_GLOW}44` : `0 0 8px ${GOLD}88`, fontWeight: 'bold', fontStyle: isArtifact ? 'italic' : 'normal' }}>{match}</mark><span>{after}</span></>);
  };
  return (
    <div style={{ background: `radial-gradient(ellipse at 30% 15%,#f8f0d8 0%,${PARCHMENT} 40%,${PARCHMENT_AGE} 100%)`, border: isArtifact ? `2px solid ${ARTIFACT_GLOW}88` : `2px solid ${WOOD_LIGHT}88`, borderRadius: 4, padding: '28px 36px', boxShadow: isArtifact ? `inset 0 0 80px rgba(0,0,0,0.1), 0 16px 60px rgba(0,0,0,0.7), 0 0 60px ${ARTIFACT_GLOW}22` : `inset 0 0 80px rgba(0,0,0,0.1), 0 16px 60px rgba(0,0,0,0.7)`, position: 'relative', transition: 'box-shadow 1s ease' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 0, height: 0, borderStyle: 'solid', borderWidth: '0 28px 28px 0', borderColor: `transparent ${PARCHMENT_AGE} transparent transparent` }} />
      <div style={{ textAlign: 'center', color: `${FADED}88`, fontSize: 13, marginBottom: 14, letterSpacing: '0.35em' }}>✦ ✦ ✦</div>
      <div style={{ textAlign: 'center', fontSize: 10, color: FADED, fontStyle: 'italic', marginBottom: 20, letterSpacing: '0.12em', borderBottom: `1px solid ${FADED}44`, paddingBottom: 16, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif' }}>
        Hexagon {truncHex(hex)}&ensp;·&ensp;Wall {wall}&ensp;·&ensp;Shelf {toRoman(shelf)}&ensp;·&ensp;Volume {toRoman(volume)}&ensp;·&ensp;Page {pageNum}
      </div>
      {isArtifact && showHighlight && (<div style={{ fontSize: 11, color: '#8a6800', fontStyle: 'italic', marginBottom: 16, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', letterSpacing: '0.06em', padding: '8px 12px', background: `${ARTIFACT_GLOW}22`, borderLeft: `2px solid ${ARTIFACT_GLOW}88`, borderRadius: '0 3px 3px 0' }}>✦ &ensp;Something coherent surfaces from the noise.</div>)}
      {highlight && !isArtifact && showHighlight && (<div style={{ fontSize: 11, color: GOLD, fontStyle: 'italic', marginBottom: 14, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', letterSpacing: '0.04em' }}>Your text is highlighted within.</div>)}
      <pre style={{ fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontSize: 12.5, color: INK, whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 2.1, margin: 0, height: 420, overflowY: 'scroll', letterSpacing: '0.025em' }}>{renderContent()}</pre>
      {typewrite && !done && (<span style={{ display: 'inline-block', width: 2, height: 14, background: INK, marginLeft: 1, animation: 'babelBlink 0.7s step-end infinite', verticalAlign: 'text-bottom' }} />)}
      <div style={{ textAlign: 'center', color: `${FADED}88`, fontSize: 13, marginTop: 16, letterSpacing: '0.35em', borderTop: `1px solid ${FADED}44`, paddingTop: 16 }}>✦</div>
    </div>
  );
}

interface Coords { hexagon: string; wall: number; shelf: number; volume: number; global_index_preview: string; }

export default function Babel() {
  const [mode, setMode] = useState<'find' | 'explore' | 'wander'>('find');
  const [inputText, setInputText]     = useState('');
  const [coords, setCoords]           = useState<Coords | null>(null);
  const [coordsVisible, setCoordsVisible] = useState(false);
  const [findLoading, setFindLoading] = useState(false);
  const [findPage, setFindPage]       = useState<PageData | null>(null);
  const [hexInput, setHexInput]       = useState('');
  const [wall, setWall]               = useState(1);
  const [shelf, setShelf]             = useState(1);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [activePage, setActivePage]   = useState<PageData | null>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [visitedVols, setVisitedVols] = useState<Set<string>>(new Set());
  const [exploreSearchText, setExploreSearchText] = useState('');
  const addressBook = useRef<Record<string, string>>({});
  const [wanderPage, setWanderPage]       = useState<PageData | null>(null);
  const [wanderLoading, setWanderLoading] = useState(false);
  const [wanderKey, setWanderKey]         = useState(0);

  const fetchPage = useCallback(async (hex: string, w: number, s: number, v: number, text = '', pg = 1): Promise<PageData> => {
    const params = new URLSearchParams({ hexagon: hex, wall: String(w), shelf: String(s), volume: String(v), page: String(pg) });
    if (text) params.set('text', text);
    const res = await fetch(`/api/babel?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { page: data.page ?? data.error ?? 'The page dissolves before your eyes.', highlight: data.highlight ?? null, hex, wall: w, shelf: s, volume: v, pageNum: pg, isArtifact: data.isArtifact ?? false, artifact: data.artifact ?? null };
  }, []);

  async function findAddress() {
    if (!inputText.trim()) return;
    setFindLoading(true); setCoords(null); setCoordsVisible(false); setFindPage(null);
    try {
      const res = await fetch(`/api/babel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: inputText }) });
      if (!res.ok) throw new Error(`POST ${res.status}`);
      const c: Coords = await res.json();
      setCoords(c); setCoordsVisible(true);
      const addrKey = `${c.hexagon}-${c.wall}-${c.shelf}-${c.volume}`;
      addressBook.current[addrKey] = inputText;
      const pd = await fetchPage(c.hexagon, c.wall, c.shelf, c.volume, inputText);
      setFindPage(pd);
    } catch (err) { console.error('findAddress failed:', err); }
    setFindLoading(false);
  }

  async function openVolume(vol: number, currentHex: string, currentWall: number, currentShelf: number) {
    const hex = currentHex || randomHex();
    if (!currentHex) setHexInput(hex);
    setPageLoading(true); setActivePage(null);
    const volKey = `${currentShelf}-${vol}`;
    setVisitedVols(prev => new Set([...prev, volKey]));
    try {
      const addrKey = `${hex}-${currentWall}-${currentShelf}-${vol}`;
      const searchText = addressBook.current[addrKey] ?? exploreSearchText;
      setCurrentPageNum(1);
      const pd = await fetchPage(hex, currentWall, currentShelf, vol, searchText, 1);
      setActivePage(pd);
    } catch (err) { console.error('openVolume failed:', err); }
    setPageLoading(false);
  }

  async function goToCoords() {
    if (!coords) return;
    setHexInput(coords.hexagon); setWall(coords.wall); setShelf(coords.shelf);
    setExploreSearchText(inputText); setMode('explore');
    setPageLoading(true); setActivePage(null);
    try {
      const pd = await fetchPage(coords.hexagon, coords.wall, coords.shelf, coords.volume, inputText);
      setActivePage(pd);
    } catch (err) { console.error('goToCoords failed:', err); }
    setPageLoading(false);
  }

  async function wander() {
    const hex = randomHex(); const w = Math.ceil(Math.random() * 4); const s = Math.ceil(Math.random() * 5); const v = Math.ceil(Math.random() * 32);
    setWanderLoading(true); setWanderPage(null);
    try { const pd = await fetchPage(hex, w, s, v); setWanderPage(pd); setWanderKey(k => k + 1); } catch (err) { console.error('wander failed:', err); }
    setWanderLoading(false);
  }

  const tabStyle = (m: string): React.CSSProperties => ({ padding: '8px 22px', fontSize: 12, cursor: 'pointer', background: 'transparent', color: mode === m ? GOLD_BRIGHT : FADED, border: 'none', borderBottom: mode === m ? `2px solid ${GOLD_BRIGHT}` : '2px solid transparent', fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontStyle: 'italic', letterSpacing: '0.05em', marginBottom: -1, transition: 'all 0.15s' });
  const inputStyle: React.CSSProperties = { width: '100%', background: '#110b03', border: `1px solid ${WOOD_LIGHT}55`, color: PARCHMENT_AGE, padding: '8px 10px', fontSize: 12, borderRadius: 3, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 9, color: FADED, marginBottom: 6, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: '"Palatino Linotype",Palatino,Georgia,serif' };
  const goldBtn = (disabled = false): React.CSSProperties => ({ padding: '9px 30px', background: disabled ? `${GOLD_DIM}66` : `linear-gradient(135deg,${GOLD} 0%,${GOLD_BRIGHT} 50%,${GOLD} 100%)`, color: INK, border: 'none', borderRadius: 3, cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 13, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontStyle: 'italic', letterSpacing: '0.05em', boxShadow: disabled ? 'none' : `0 2px 12px ${GOLD}44` });

  return (
    <>
      <style>{`
        @keyframes babelBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes babelFade { from { opacity: 0.4; } to { opacity: 1; } }
        @keyframes babelPulse { 0%, 100% { opacity: 0.06; transform: scale(1); } 50% { opacity: 0.13; transform: scale(1.04); } }
      `}</style>
      <div style={{ height: '100%', overflow: 'auto', background: `radial-gradient(ellipse at 50% 0%,#1e1006 0%,#0a0703 55%,#060402 100%)`, padding: '28px 32px', fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', position: 'relative' }}>
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(ellipse,${GOLD}22 0%,transparent 70%)`, pointerEvents: 'none', zIndex: 0, animation: 'babelPulse 8s ease-in-out infinite' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: 26, borderBottom: `1px solid ${GOLD_DIM}28`, paddingBottom: 22 }}>
            <h2 style={{ fontSize: 24, color: PARCHMENT, margin: '0 0 8px', letterSpacing: '0.06em', fontWeight: 'normal', textShadow: `0 0 50px ${GOLD}33` }}>The Library of Babel</h2>
            <p style={{ fontSize: 12.5, color: FADED, margin: '0 0 6px', fontStyle: 'italic', lineHeight: 1.7 }}>Every text that has ever been written — or ever will be — already exists at a fixed address.</p>
            <p style={{ fontSize: 10, color: `${FADED}77`, margin: 0, fontStyle: 'italic', letterSpacing: '0.05em' }}>— Jorge Luis Borges</p>
          </div>
          <div style={{ display: 'flex', marginBottom: 30, borderBottom: `1px solid ${WOOD_LIGHT}33` }}>
            <button style={tabStyle('find')} onClick={() => setMode('find')}>Find Its Address</button>
            <button style={tabStyle('explore')} onClick={() => setMode('explore')}>Explore a Location</button>
            <button style={tabStyle('wander')} onClick={() => setMode('wander')}>Wander</button>
          </div>

          {mode === 'find' && (
            <div>
              <p style={{ fontSize: 12, color: FADED, fontStyle: 'italic', lineHeight: 1.85, marginTop: 0, marginBottom: 18, maxWidth: 580 }}>Every string of characters exists somewhere in the Library. Enter any text and its exact address will be revealed — and the page opened, with your words highlighted within the surrounding noise.</p>
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 9, color: FADED, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>Known texts — click to locate</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[{ label: 'Call me Ishmael.', text: 'Call me Ishmael.' },{ label: 'It was the best of times', text: 'It was the best of times, it was the worst of times.' },{ label: 'In the beginning', text: 'In the beginning God created the heavens and the earth.' },{ label: 'To be, or not to be', text: 'To be, or not to be, that is the question.' },{ label: 'Your name', text: '' }].map(({ label, text }) => (
                    <button key={label} onClick={() => { setInputText(text || 'Joseph Voelbel'); }} style={{ padding: '5px 14px', background: 'transparent', border: `1px solid ${GOLD_DIM}44`, borderRadius: 3, color: `${FADED}cc`, fontSize: 11, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontStyle: 'italic', cursor: 'pointer', letterSpacing: '0.03em', transition: 'border-color 0.15s, color 0.15s' }} onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = `${GOLD_DIM}aa`; (e.target as HTMLButtonElement).style.color = PARCHMENT_AGE; }} onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = `${GOLD_DIM}44`; (e.target as HTMLButtonElement).style.color = `${FADED}cc`; }}>{label}</button>
                  ))}
                </div>
              </div>
              <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) findAddress(); }} placeholder="Enter any text — a sentence, a name, a line of poetry…" rows={4} style={{ ...inputStyle, fontSize: 14, resize: 'vertical', lineHeight: 1.75, marginBottom: 16 }} />
              <button onClick={findAddress} disabled={findLoading || !inputText.trim()} style={goldBtn(findLoading || !inputText.trim())}>{findLoading ? 'Searching the stacks…' : 'Find Its Address'}</button>
              {coords && (
                <div style={{ marginTop: 32 }}>
                  <div style={{ background: `linear-gradient(135deg,${WOOD_DARK} 0%,#140c04 100%)`, border: `1px solid ${GOLD_DIM}55`, borderRadius: 6, padding: '20px 26px', boxShadow: `0 0 50px ${GOLD}14`, marginBottom: 26 }}>
                    <div style={{ fontSize: 9, color: GOLD, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 20 }}>✦&ensp;Address Located&ensp;✦</div>
                    <CoordReveal coords={coords} visible={coordsVisible} />
                    <button onClick={goToCoords} style={{ padding: '9px 24px', background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD_DIM}aa`, borderRadius: 3, cursor: 'pointer', fontSize: 13, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontStyle: 'italic', letterSpacing: '0.04em', boxShadow: `0 0 16px ${GOLD}22` }}>✦ Navigate to the shelf →</button>
                  </div>
                  {findLoading && !findPage && <Descending />}
                  {findPage && <PageDisplay {...findPage} typewrite={false} />}
                </div>
              )}
            </div>
          )}

          {mode === 'explore' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', gap: 10, marginBottom: 8 }}>
                <div><label style={labelStyle}>Hexagon — Room Identifier</label><input value={hexInput} onChange={e => { setHexInput(e.target.value); setExploreSearchText(''); }} placeholder="Leave blank to roam at random" style={{ ...inputStyle, fontFamily: 'monospace', fontSize: 11 }} /></div>
                <div><label style={labelStyle}>Wall (1–4)</label><select value={wall} onChange={e => setWall(parseInt(e.target.value))} style={inputStyle}>{[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
                <div><label style={labelStyle}>Shelf (I–V)</label><select value={shelf} onChange={e => setShelf(parseInt(e.target.value))} style={inputStyle}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{toRoman(n)}</option>)}</select></div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}><button onClick={() => { const h = randomHex(); const w = Math.ceil(Math.random()*4); const s = Math.ceil(Math.random()*5); setHexInput(h); setWall(w); setShelf(s); setActivePage(null); }} style={{ ...goldBtn(false), padding: '8px 10px', fontSize: 11, whiteSpace: 'nowrap' }}>Random room</button></div>
              </div>
              <p style={{ color: `${FADED}77`, fontStyle: 'italic', fontSize: 10, marginBottom: 12, lineHeight: 1.6 }}>Hexagon = unique room ID · 4 walls · 5 shelves · 32 volumes per shelf.</p>
              <ShelfUnit shelfNum={shelf} selectedVol={activePage?.shelf === shelf ? (activePage?.volume ?? null) : null} visitedVols={visitedVols} onSelect={v => openVolume(v, hexInput, wall, shelf)} />
              {pageLoading && <Descending />}
              {activePage && !pageLoading && (
                <div style={{ marginTop: 20 }}>
                  <PageDisplay {...activePage} typewrite={false} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 14 }}>
                    <button disabled={currentPageNum <= 1 || pageLoading} onClick={async () => { const pg = currentPageNum - 1; setCurrentPageNum(pg); setPageLoading(true); const addrKey = `${activePage.hex}-${activePage.wall}-${activePage.shelf}-${activePage.volume}`; const searchText = addressBook.current[addrKey] ?? exploreSearchText; const pd = await fetchPage(activePage.hex, activePage.wall, activePage.shelf, activePage.volume, searchText, pg); setActivePage(pd); setPageLoading(false); }} style={{ background: 'none', border: `1px solid ${GOLD_DIM}44`, color: `${FADED}cc`, borderRadius: 3, padding: '4px 14px', cursor: 'pointer', fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontStyle: 'italic', fontSize: 12 }}>← Prev</button>
                    <span style={{ color: FADED, fontStyle: 'italic', fontSize: 12, fontFamily: '"Palatino Linotype",Palatino,Georgia,serif' }}>Page {currentPageNum} of 410</span>
                    <button disabled={currentPageNum >= 410 || pageLoading} onClick={async () => { const pg = currentPageNum + 1; setCurrentPageNum(pg); setPageLoading(true); const addrKey = `${activePage.hex}-${activePage.wall}-${activePage.shelf}-${activePage.volume}`; const searchText = addressBook.current[addrKey] ?? exploreSearchText; const pd = await fetchPage(activePage.hex, activePage.wall, activePage.shelf, activePage.volume, searchText, pg); setActivePage(pd); setPageLoading(false); }} style={{ background: 'none', border: `1px solid ${GOLD_DIM}44`, color: `${FADED}cc`, borderRadius: 3, padding: '4px 14px', cursor: 'pointer', fontFamily: '"Palatino Linotype",Palatino,Georgia,serif', fontStyle: 'italic', fontSize: 12 }}>Next →</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {mode === 'wander' && (
            <div>
              <p style={{ fontSize: 13, color: FADED, fontStyle: 'italic', lineHeight: 1.95, marginBottom: 28, maxWidth: 560 }}>The Library is infinite and cyclical. No map has ever been drawn that covers it. Its true extent is unknowable. Choose a door at random and descend.</p>
              <button onClick={wander} disabled={wanderLoading} style={{ ...goldBtn(wanderLoading), padding: '12px 40px', fontSize: 15 }}>{wanderLoading ? 'Descending…' : wanderPage ? 'Open Another Door' : 'Open a Door at Random'}</button>
              {wanderLoading && <Descending />}
              {wanderPage && !wanderLoading && (<div style={{ marginTop: 32 }} key={wanderKey}><PageDisplay {...wanderPage} typewrite={true} /></div>)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}