'use client'

import React from 'react'

type SvgProps = {
  className?: string
  style?: React.CSSProperties
}

function BoltSvg({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 44" fill="currentColor" aria-hidden="true">
      <polygon points="12,0 22,5.5 22,18 12,23.5 2,18 2,5.5" />
      <rect x="10" y="24" width="4" height="14" />
      <rect x="8" y="27" width="8" height="1.5" opacity="0.5" />
      <rect x="8" y="31" width="8" height="1.5" opacity="0.5" />
      <rect x="8" y="35" width="8" height="1.5" opacity="0.5" />
      <polygon points="10,38 14,38 12,44" />
    </svg>
  )
}

function NutSvg({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 1 22 6.5v11L12 23 2 17.5v-11L12 1zm0 5a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
      />
    </svg>
  )
}

function WasherSvg({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a7 7 0 1 1 0 14A7 7 0 0 1 12 5zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      />
    </svg>
  )
}

function AnchorSvg({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 16 36" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="16" height="5" rx="2.5" />
      <path fillRule="evenodd" d="M4 5h8v18H4V5zm3 3v12h2V8H7z" />
      <rect x="0" y="23" width="16" height="5" rx="2.5" />
      <rect x="0" y="28" width="7" height="5" rx="1.5" />
      <rect x="9" y="28" width="7" height="5" rx="1.5" />
    </svg>
  )
}

function BushingSvg({ className, style }: SvgProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 32" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="24" height="6" rx="3" />
      <path fillRule="evenodd" d="M4 6h16v20H4V6zm4 4v12h8V10H8z" />
      <rect x="0" y="26" width="24" height="6" rx="3" />
    </svg>
  )
}

const PIECES: {
  Svg: (props: SvgProps) => React.JSX.Element
  tx: string
  ty: string
  rot: string
  delay: string
  cls: string
}[] = [
  { Svg: BoltSvg,    tx: '120px',  ty: '0px',    rot: '180deg', delay: '0s',   cls: 'w-8 h-12 sm:w-10 sm:h-16' },
  { Svg: NutSvg,     tx: '37px',   ty: '114px',  rot: '144deg', delay: '0.4s', cls: 'w-7 h-7 sm:w-10 sm:h-10' },
  { Svg: AnchorSvg,  tx: '-97px',  ty: '71px',   rot: '108deg', delay: '0.8s', cls: 'w-5 h-9 sm:w-7 sm:h-12' },
  { Svg: BushingSvg, tx: '-97px',  ty: '-71px',  rot: '72deg',  delay: '1.2s', cls: 'w-9 h-7 sm:w-12 sm:h-9' },
  { Svg: WasherSvg,  tx: '37px',   ty: '-114px', rot: '36deg',  delay: '1.6s', cls: 'w-7 h-7 sm:w-10 sm:h-10' },
]

export function ExplodingScene() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      data-testid="exploding-scene"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(245,166,35,0.18)_0%,transparent_70%)]" />

      {PIECES.map(({ Svg, tx, ty, rot, delay, cls }, i) => (
        <div
          key={i}
          className={`hero-piece absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-amber/25 ${cls}`}
          style={
            {
              '--tx': tx,
              '--ty': ty,
              '--rot': rot,
              animation: `explode-piece 6s ${delay} ease-in-out infinite`,
            } as React.CSSProperties
          }
        >
          <Svg className="w-full h-full" />
        </div>
      ))}
    </div>
  )
}
