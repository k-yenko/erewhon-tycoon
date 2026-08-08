// Smooth vector icon set (24x24), Lemonade Tycoon style: flat fills,
// soft ink outlines, one highlight. Same API as the old pixel set.
import type { ReactNode, CSSProperties } from 'react';

export const INK = '#1a1a18';
const CREAM = '#faf7f0';
const KRAFT = '#c9b99a';
const KRAFT_D = '#a8977a';
const RED = '#c96a5a';
const PINK = '#e8b4c8';
const BLUE = '#7fb4c9';
const GREEN = '#9db98a';
const BROWN = '#8a6f4d';
const LIGHT = '#cfe3ea';
const SOFT = '#4a4740';
const YELLOW = '#e6c86e';

const S = { stroke: INK, strokeWidth: 1.4, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

const ICONS: Record<string, ReactNode> = {
  strawberry: (
    <g>
      {/* back berry */}
      <path d="M17 8 C20 8 21.5 10 21.5 12 C21.5 15 19.5 17.5 17.5 17.5 C16.5 17.5 15.8 17 15.3 16.2 C17 14.5 17.8 11.5 17 8Z" fill="#a83428" {...S} />
      {/* front berry */}
      <path d="M10 5 C8.5 3.8 7.2 3.8 6.2 4.6 C7.4 5.5 8.7 6 10 6 C11.3 6 12.6 5.5 13.8 4.6 C12.8 3.8 11.5 3.8 10 5Z" fill={GREEN} {...S} />
      <path d="M10 6 C14.5 6 16.8 8.7 16.8 11.8 C16.8 16.3 13.2 20.5 10 20.5 C6.8 20.5 3.2 16.3 3.2 11.8 C3.2 8.7 5.5 6 10 6Z" fill={RED} {...S} />
      <path d="M6 9 C6.8 7.8 8 7 9.4 6.9" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />
      <circle cx="8" cy="11" r="0.8" fill={YELLOW} />
      <circle cx="12.5" cy="11.5" r="0.8" fill={YELLOW} />
      <circle cx="10" cy="14.5" r="0.8" fill={YELLOW} />
      <circle cx="8" cy="17" r="0.8" fill={YELLOW} />
      <circle cx="12.4" cy="16.6" r="0.8" fill={YELLOW} />
    </g>
  ),
  coconut: (
    <g>
      <ellipse cx="12" cy="20" rx="8" ry="1.6" fill={INK} opacity="0.12" />
      <circle cx="12" cy="11.5" r="9" fill={BROWN} {...S} />
      <path d="M5.5 8 C6.7 5.6 9 4 11.5 3.8" stroke="#a98a63" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="11.5" r="6.2" fill="#fff" {...S} />
      <circle cx="12" cy="11.5" r="3.2" fill={CREAM} {...S} />
      <path d="M8.2 8.8 C9 7.8 10 7.2 11.2 7" stroke="#e6e0d2" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  ),
  seamoss: (
    <g>
      <rect x="8" y="2.5" width="8" height="3" rx="1" fill={KRAFT} {...S} />
      <rect x="8.8" y="3.1" width="2.4" height="0.9" rx="0.4" fill="#fff" opacity="0.6" />
      <path d="M6.5 6 H17.5 C18.5 6 19 6.8 19 7.8 V19 C19 20.5 18 21.5 16.5 21.5 H7.5 C6 21.5 5 20.5 5 19 V7.8 C5 6.8 5.5 6 6.5 6Z" fill={PINK} {...S} />
      {/* glass gloss */}
      <path d="M7 8.5 C7 12 7 16 7.4 19" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M16.8 8 C17 9.5 17.1 11 17 12.5" stroke="#a83a5e" strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.5" />
      <circle cx="10.5" cy="11.5" r="1.1" fill="#fff" opacity="0.8" />
      <circle cx="14" cy="15" r="1.4" fill="#fff" opacity="0.6" />
      <circle cx="10.5" cy="17.5" r="0.9" fill="#fff" opacity="0.8" />
    </g>
  ),
  ice: (
    <g>
      {/* back cube */}
      <path d="M11 6.5 L16 4 L21 6.5 V11.5 L16 14 L11 11.5Z" fill="#a5cfe6" {...S} />
      <path d="M11 6.5 L16 8.7 L21 6.5 M16 8.7 V14" fill="none" {...S} strokeWidth={1} />
      {/* front cube */}
      <path d="M3 11 L9 8 L15 11 V17 L9 20 L3 17Z" fill={BLUE} {...S} />
      <path d="M3 11 L9 13.6 L15 11 M9 13.6 V20" fill="none" {...S} strokeWidth={1} />
      <path d="M4.6 10.4 L7.5 9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    </g>
  ),
  cup: (
    <g>
      {/* stacked cups behind, one forward — like the original's stack */}
      <path d="M10 3 H20 L19.4 6 H10.6Z" fill="#fff" {...S} strokeWidth={1.1} />
      <path d="M10.4 6 H19.6 L19 9 H11Z" fill="#f0ede4" {...S} strokeWidth={1.1} />
      <path d="M10.8 9 H19.2 L18.6 12 H11.4Z" fill="#fff" {...S} strokeWidth={1.1} />
      <path d="M3.5 9.5 H13.5 L12.3 21 H4.7Z" fill={PINK} {...S} />
      <path d="M3.3 12.3 H13.7" fill="none" {...S} strokeWidth={1.1} />
      <ellipse cx="7" cy="15.5" rx="0.9" ry="1.2" fill="#fff" opacity="0.75" />
    </g>
  ),
  ledger: (
    <g>
      <rect x="4" y="3.5" width="16" height="17" rx="1.5" fill={CREAM} {...S} />
      <path d="M9.5 3.5 V20.5" fill="none" {...S} />
      <path d="M12.5 8 H17 M12.5 11 H17 M12.5 14 H17" stroke={KRAFT_D} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  ),
  calendar: (
    <g>
      <rect x="4.5" y="4" width="15" height="16" rx="1.5" fill="#fff" {...S} />
      <rect x="4.5" y="4" width="15" height="4.6" fill="#2f3f8c" stroke={INK} strokeWidth="1.4" />
      <path d="M12 11 L12 17.5 M10.4 12.2 L12 11 M10.4 17.5 H13.6" stroke="#2f3f8c" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  ),
  chart: (
    <g>
      <path d="M6 19 L9 21 M18 19 L15 21" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M4 4 L20 4 L21.5 18.5 L5.5 18.5Z" fill="#fff" {...S} />
      <path d="M8.2 4 L9.2 18.5 M12.6 4 L13.2 18.5 M16.8 4 L17.2 18.5 M4.4 8 H20.5 M4.8 12 H20.9 M5.2 15.6 H21.2" stroke="#d0ccc0" strokeWidth="0.9" fill="none" />
      <path d="M5.5 14 L9 11 L12 13.5 L15.5 8.5 L20 10.5" stroke="#d94436" strokeWidth="1.7" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  ),
  bookred: (
    <g>
      <path d="M3.5 13 L12 9 L20.5 13 L12 17Z" fill="#fff" {...S} />
      <path d="M3.5 13 V15.5 L12 19.5 L20.5 15.5 V13 L12 17Z" fill="#f0ede4" {...S} strokeWidth={1.1} />
      <path d="M3.5 10.8 L12 6.8 L20.5 10.8 L12 14.8Z" fill={RED} {...S} />
      <path d="M6.5 10.6 L11 8.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
    </g>
  ),
  bookgold: (
    <g>
      <path d="M3.5 13 L12 9 L20.5 13 L12 17Z" fill="#fff" {...S} />
      <path d="M3.5 13 V15.5 L12 19.5 L20.5 15.5 V13 L12 17Z" fill="#f0ede4" {...S} strokeWidth={1.1} />
      <path d="M3.5 10.8 L12 6.8 L20.5 10.8 L12 14.8Z" fill={YELLOW} {...S} />
      <path d="M6.5 10.6 L11 8.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
    </g>
  ),
  pin: (
    <g>
      <path d="M12 21.5 C12 21.5 5 14.5 5 9.5 C5 5.5 8 2.5 12 2.5 C16 2.5 19 5.5 19 9.5 C19 14.5 12 21.5 12 21.5Z" fill={RED} {...S} />
      <circle cx="12" cy="9.5" r="2.8" fill={CREAM} {...S} />
    </g>
  ),
  store: (
    <g>
      <rect x="4.5" y="9" width="15" height="11" fill={CREAM} {...S} />
      <path d="M3.5 9 L5.5 4 H18.5 L20.5 9 C20.5 10.5 19.2 11.5 17.7 11.5 C16.5 11.5 15.4 10.8 15.2 9.8 C15 10.8 13.9 11.5 12.7 11.5 H11.3 C10.1 11.5 9 10.8 8.8 9.8 C8.6 10.8 7.5 11.5 6.3 11.5 C4.8 11.5 3.5 10.5 3.5 9Z" fill={KRAFT} {...S} />
      <rect x="7" y="13.5" width="4" height="6.5" fill={SOFT} {...S} />
      <rect x="13.5" y="13.5" width="4" height="4" fill={LIGHT} {...S} />
    </g>
  ),
  person: (
    <g>
      <circle cx="12" cy="6.5" r="3.8" fill={KRAFT} {...S} />
      <path d="M5 21 C5 16.5 8 14 12 14 C16 14 19 16.5 19 21Z" fill={GREEN} {...S} />
    </g>
  ),
  camera: (
    <g>
      <rect x="3.5" y="7" width="17" height="12.5" rx="2" fill={SOFT} {...S} />
      <path d="M9 7 L10.5 4.5 H13.5 L15 7" fill={SOFT} {...S} />
      <circle cx="12" cy="13" r="3.8" fill={LIGHT} {...S} />
      <circle cx="12" cy="13" r="1.6" fill={BLUE} {...S} />
      <circle cx="17.5" cy="9.5" r="0.9" fill={PINK} />
    </g>
  ),
  blender: (
    <g>
      <path d="M8 3.5 H16 L15 13.5 H9Z" fill={PINK} {...S} />
      <path d="M8.4 6.5 H15.6" fill="none" {...S} />
      <rect x="9" y="13.5" width="6" height="2.5" fill={SOFT} {...S} />
      <path d="M7 16 H17 L16.2 20.5 H7.8Z" fill={KRAFT} {...S} />
      <ellipse cx="11" cy="9.5" rx="0.9" ry="1.4" fill="#fff" opacity="0.7" />
    </g>
  ),
  box: (
    <g>
      <path d="M4 8 L12 4 L20 8 V17 L12 21 L4 17Z" fill={KRAFT} {...S} />
      <path d="M4 8 L12 12 L20 8" fill="none" {...S} />
      <path d="M12 12 V21" fill="none" {...S} />
      <path d="M8 6 L16 10" fill="none" stroke={KRAFT_D} strokeWidth="1.4" />
    </g>
  ),
  gear: (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <rect
            key={i}
            x="10.4"
            y="1.5"
            width="3.2"
            height="5"
            rx="1"
            fill={SOFT}
            stroke={INK}
            strokeWidth="1"
            transform={`rotate(${(a * 180) / Math.PI} 12 12)`}
          />
        );
      })}
      <circle cx="12" cy="12" r="7" fill={SOFT} {...S} />
      <circle cx="12" cy="12" r="3" fill={CREAM} {...S} />
    </g>
  ),
  heart: (
    <g>
      <path
        d="M12 20.5 C6 16 3 12.5 3 9 C3 6.2 5.2 4 8 4 C9.6 4 11.1 4.8 12 6.1 C12.9 4.8 14.4 4 16 4 C18.8 4 21 6.2 21 9 C21 12.5 18 16 12 20.5Z"
        fill={PINK}
        {...S}
      />
      <path d="M6.5 8.5 C6.7 7.3 7.5 6.4 8.6 6.1" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  smile: (
    <g>
      <circle cx="12" cy="12" r="9" fill={PINK} {...S} />
      <circle cx="9" cy="10" r="1.2" fill={INK} />
      <circle cx="15" cy="10" r="1.2" fill={INK} />
      <path d="M8.5 14 C10 16.5 14 16.5 15.5 14" fill="none" {...S} strokeWidth={1.7} />
    </g>
  ),
  frown: (
    <g>
      <circle cx="12" cy="12" r="9" fill={GREEN} {...S} />
      <circle cx="9" cy="10" r="1.2" fill={INK} />
      <circle cx="15" cy="10" r="1.2" fill={INK} />
      <path d="M8.5 16.5 C10 14 14 14 15.5 16.5" fill="none" {...S} strokeWidth={1.7} />
    </g>
  ),
  tag: (
    <g>
      <circle cx="12" cy="12" r="9" fill={YELLOW} {...S} />
      <path d="M14.8 8.6 C14 7.6 12.8 7.2 11.6 7.5 C10.2 7.8 9.4 9 9.6 10.2 C9.8 11.4 11 12 12.4 12.2 C13.8 12.4 14.8 13.1 14.7 14.3 C14.6 15.5 13.4 16.4 12 16.4 C10.8 16.4 9.8 15.8 9.2 14.9" fill="none" {...S} strokeWidth={1.7} />
      <path d="M12 5.5 V18.5" fill="none" {...S} strokeWidth={1.4} />
    </g>
  ),
  hourglass: (
    <g>
      <path d="M6 3.5 H18 M6 20.5 H18" fill="none" {...S} strokeWidth={1.8} />
      <path d="M7.5 3.5 C7.5 8 10.5 10 12 12 C13.5 10 16.5 8 16.5 3.5Z" fill={LIGHT} {...S} />
      <path d="M7.5 20.5 C7.5 16 10.5 14 12 12 C13.5 14 16.5 16 16.5 20.5Z" fill={LIGHT} {...S} />
      <path d="M10 17.5 C11 16.5 13 16.5 14 17.5 L15 20.5 H9Z" fill={KRAFT} stroke="none" />
    </g>
  ),
  sun: (
    <g>
      <circle cx="12" cy="12" r="5" fill={YELLOW} {...S} />
      <path d="M12 2.5 V5 M12 19 V21.5 M2.5 12 H5 M19 12 H21.5 M5.3 5.3 L7 7 M17 17 L18.7 18.7 M18.7 5.3 L17 7 M7 17 L5.3 18.7" fill="none" {...S} strokeWidth={1.7} />
    </g>
  ),
  cloud: (
    <g>
      <path d="M6.5 17.5 C4 17.5 2.5 15.8 2.5 13.8 C2.5 11.9 4 10.4 6 10.3 C6.5 7.5 9 5.5 12 5.5 C15 5.5 17.5 7.5 18 10.3 C20 10.4 21.5 11.9 21.5 13.8 C21.5 15.8 20 17.5 17.5 17.5Z" fill={LIGHT} {...S} />
    </g>
  ),
  wind: (
    <g>
      <path d="M3 8.5 H14 C16 8.5 17 7.5 17 6 C17 4.8 16 4 15 4" fill="none" {...S} strokeWidth={1.7} />
      <path d="M3 13 H18.5 C20.5 13 21.5 14 21.5 15.5 C21.5 16.8 20.5 17.7 19.3 17.7" fill="none" {...S} strokeWidth={1.7} />
      <path d="M3 17.5 H11" fill="none" {...S} strokeWidth={1.7} />
    </g>
  ),
  rain: (
    <g>
      <path d="M6.5 14 C4.3 14 3 12.6 3 10.9 C3 9.3 4.2 8 6 7.9 C6.5 5.5 8.7 3.8 11.5 3.8 C14.2 3.8 16.4 5.5 16.9 7.9 C18.8 8 20 9.3 20 10.9 C20 12.6 18.7 14 16.5 14Z" fill={LIGHT} {...S} />
      <path d="M8 16.5 L7 19.5 M12 16.5 L11 19.5 M16 16.5 L15 19.5" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" />
    </g>
  ),
  storm: (
    <g>
      <path d="M6.5 13 C4.3 13 3 11.6 3 9.9 C3 8.3 4.2 7 6 6.9 C6.5 4.5 8.7 2.8 11.5 2.8 C14.2 2.8 16.4 4.5 16.9 6.9 C18.8 7 20 8.3 20 9.9 C20 11.6 18.7 13 16.5 13Z" fill={SOFT} {...S} />
      <path d="M12.5 13.5 L9.5 17.5 H12 L10.5 21.5 L15 16.5 H12.5 L14 13.5Z" fill={YELLOW} {...S} />
    </g>
  ),
  heat: (
    <g>
      <path d="M10 4 C10 2.9 10.9 2 12 2 C13.1 2 14 2.9 14 4 V13 C15.2 13.8 16 15.1 16 16.7 C16 19.1 14.2 21 12 21 C9.8 21 8 19.1 8 16.7 C8 15.1 8.8 13.8 10 13Z" fill={CREAM} {...S} />
      <circle cx="12" cy="16.7" r="2.4" fill={RED} />
      <path d="M12 15 V8" stroke={RED} strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  tent: (
    <g>
      <path d="M2.5 13 L12 5 L21.5 13" fill="none" {...S} strokeWidth={1.7} />
      <path d="M4 12 L12 5.5 L20 12 C20 13.8 18.5 15 16.8 15 C15.5 15 14.4 14.3 14 13.3 C13.6 14.3 12.6 15 12 15 C11.4 15 10.4 14.3 10 13.3 C9.6 14.3 8.5 15 7.2 15 C5.5 15 4 13.8 4 12Z" fill={KRAFT} {...S} />
      <path d="M5.5 15 V20.5 M18.5 15 V20.5" fill="none" {...S} strokeWidth={1.7} />
    </g>
  ),
  tablet: (
    <g>
      <rect x="6" y="3" width="12" height="18" rx="2" fill={SOFT} {...S} />
      <rect x="8" y="5.5" width="8" height="11.5" fill={LIGHT} {...S} strokeWidth={1} />
      <path d="M12 8.5 V14 M9.8 10 C9.8 8.8 11 8.3 12 8.6 C13 8.9 13.6 9.4 13.4 10.4 C13.2 11.4 11 11.3 10.8 12.4 C10.6 13.4 11.4 14 12.4 14 C13.2 14 13.8 13.6 14.1 13" stroke={INK} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="19" r="1" fill={CREAM} />
    </g>
  ),
  fridge: (
    <g>
      <rect x="6" y="2.5" width="12" height="19" rx="1.5" fill={LIGHT} {...S} />
      <path d="M6 9.5 H18" fill="none" {...S} />
      <path d="M8.5 5 V7.5 M8.5 12 V16" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
  snowflake: (
    <g>
      <path d="M12 3 V21 M4.2 7.5 L19.8 16.5 M19.8 7.5 L4.2 16.5" fill="none" stroke={BLUE} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 3 L10 5 M12 3 L14 5 M12 21 L10 19 M12 21 L14 19 M4.2 7.5 L6.9 7.9 M4.2 7.5 L4.6 10.2 M19.8 16.5 L17.1 16.1 M19.8 16.5 L19.4 13.8 M19.8 7.5 L19.4 10.2 M19.8 7.5 L17.1 7.9 M4.2 16.5 L4.6 13.8 M4.2 16.5 L6.9 16.1" fill="none" stroke={BLUE} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  ),
  bell: (
    <g>
      <path d="M12 3 C12.8 3 13.4 3.6 13.4 4.4 C16.2 5 18 7.3 18 10.5 C18 14.5 19 15.5 20 16.5 H4 C5 15.5 6 14.5 6 10.5 C6 7.3 7.8 5 10.6 4.4 C10.6 3.6 11.2 3 12 3Z" fill={YELLOW} {...S} />
      <path d="M10 19 C10.3 20.2 11 21 12 21 C13 21 13.7 20.2 14 19" fill="none" {...S} strokeWidth={1.7} />
    </g>
  ),
  bulb: (
    <g>
      <path d="M12 2.5 C15.6 2.5 18.5 5.3 18.5 8.8 C18.5 11 17.4 12.7 16 13.9 C15.2 14.6 15 15.3 15 16.5 H9 C9 15.3 8.8 14.6 8 13.9 C6.6 12.7 5.5 11 5.5 8.8 C5.5 5.3 8.4 2.5 12 2.5Z" fill={YELLOW} {...S} />
      <path d="M9.5 19 H14.5 M10 21 H14" fill="none" {...S} strokeWidth={1.6} />
      <path d="M9.5 8 C9.8 6.8 10.8 6 12 6" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </g>
  ),
  mountain: (
    <g>
      <path d="M2.5 19.5 L9 6.5 L13 13 L15.5 9 L21.5 19.5Z" fill={BLUE} {...S} />
      <path d="M7.4 9.7 L9 6.5 L10.7 9.3 L9.7 10.8 L8.6 9.6Z" fill="#fff" {...S} strokeWidth={1} />
      <path d="M14.5 10.7 L15.5 9 L16.7 11.1 L15.6 12 Z" fill="#fff" {...S} strokeWidth={1} />
    </g>
  ),
  palm: (
    <g>
      <path d="M11 10 C10.5 14 10.8 17.5 11.5 21 H14 C14.2 17 13.8 13.5 13 10Z" fill={BROWN} {...S} />
      <path d="M12 10 C9 7.5 5.5 7.5 3 9.5 C6 5.8 9.5 5.5 12 7.5 C11 4.5 8.5 3 6.5 3 C10 1.8 13 3.8 13.2 7 C15 4.5 18 4 20.5 5.5 C17.5 5.8 15.5 7 14 9 C16.5 8 19.5 8.8 21 11 C18.5 9.8 15.5 10 13.5 11Z" fill={GREEN} {...S} />
    </g>
  ),
  stand: (
    <g>
      <path d="M3 8 L5 3.5 H19 L21 8Z" fill={KRAFT} {...S} />
      <path d="M3 8 C3 9.6 4.3 10.6 5.8 10.6 C7 10.6 8.1 9.9 8.3 8.9 C8.5 9.9 9.6 10.6 10.8 10.6 H13.2 C14.4 10.6 15.5 9.9 15.7 8.9 C15.9 9.9 17 10.6 18.2 10.6 C19.7 10.6 21 9.6 21 8" fill={CREAM} {...S} />
      <rect x="5" y="11.5" width="14" height="7" fill={CREAM} {...S} />
      <circle cx="8" cy="20" r="1.8" fill={SOFT} {...S} />
      <circle cx="16" cy="20" r="1.8" fill={SOFT} {...S} />
      <rect x="10" y="13" width="4" height="3" fill={PINK} {...S} strokeWidth={1} />
    </g>
  ),
  // legacy walker names — kept for API compatibility, now simple person glyphs
  walker1: (
    <g>
      <circle cx="12" cy="6" r="3.5" fill={KRAFT} {...S} />
      <path d="M6 20.5 C6 16 8.5 13.5 12 13.5 C15.5 13.5 18 16 18 20.5Z" fill={PINK} {...S} />
    </g>
  ),
  walker2: (
    <g>
      <circle cx="12" cy="6" r="3.5" fill={KRAFT} {...S} />
      <path d="M6 20.5 C6 16 8.5 13.5 12 13.5 C15.5 13.5 18 16 18 20.5Z" fill={BLUE} {...S} />
    </g>
  ),
  walker3: (
    <g>
      <circle cx="12" cy="6" r="3.5" fill={KRAFT} {...S} />
      <path d="M6 20.5 C6 16 8.5 13.5 12 13.5 C15.5 13.5 18 16 18 20.5Z" fill={GREEN} {...S} />
    </g>
  ),
};

// The pixel display face, referenced everywhere a heading needs to shout.
export const PXFONT = "'Press Start 2P', monospace";

export type IconName =
  | 'strawberry' | 'coconut' | 'seamoss' | 'ice' | 'cup' | 'heart' | 'gear'
  | 'ledger' | 'pin' | 'store' | 'person' | 'camera' | 'blender' | 'box'
  | 'calendar' | 'chart' | 'bookred' | 'bookgold'
  | 'smile' | 'frown' | 'tag' | 'hourglass'
  | 'sun' | 'cloud' | 'wind' | 'rain' | 'storm' | 'heat'
  | 'tent' | 'tablet' | 'fridge' | 'snowflake' | 'bell' | 'bulb' | 'mountain'
  | 'palm' | 'stand' | 'walker1' | 'walker2' | 'walker3';

// Embed an icon inside another SVG (nested <svg> keeps its own viewBox).
export function IconGlyph({
  name,
  x,
  y,
  size,
}: {
  name: IconName;
  x: number;
  y: number;
  size: number;
}) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24">
      {ICONS[name]}
    </svg>
  );
}

// Icon inside a white speech bubble with a tail — the original's counter style.
export function BubbleIcon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
      aria-label={name}
    >
      <path d="M5 20 L4 23.2 L9 20Z" fill="#fff" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="1" y="1" width="22" height="19.5" rx="5" fill="#fff" stroke={INK} strokeWidth="1.4" />
      <g transform="translate(3.5 2.2) scale(0.7)">{ICONS[name]}</g>
    </svg>
  );
}

export function PixelIcon({
  name,
  size = 20,
  style,
}: {
  name: IconName;
  size?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block', verticalAlign: 'middle', ...style }}
      aria-label={name}
    >
      {ICONS[name]}
    </svg>
  );
}
