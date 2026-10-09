import React from "react";
import { WORDMARK } from "../brand/paths.js";

/**
 * Logotipo horizontal para el header: banda de damero sobre el wordmark,
 * en el mismo orden que el logo bandera (damero → nombre).
 */
export function HeaderLogo({ className = "" }) {
  const [, , ww, wh] = WORDMARK.viewBox.split(" ").map(Number);
  const cols = 18;
  const cell = ww / cols;
  const cells = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < cols + 2; c++) {
      if ((r + c) % 2 === 0) cells.push(<rect key={`${r}-${c}`} x={(c - 2) * cell} y={r * cell} width={cell} height={cell} />);
    }
  }
  const top = cell * 2 + 10;
  return (
    <svg className={className} viewBox={`0 0 ${ww} ${top + wh}`} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="hd-logo-clip">
          <rect width={ww} height={cell * 2} />
        </clipPath>
      </defs>
      <g clipPath="url(#hd-logo-clip)">
        <g className="hd-logo-checker" fill="currentColor">
          {cells}
        </g>
      </g>
      <path transform={`translate(0 ${top})`} fill="currentColor" fillRule="evenodd" d={WORDMARK.d} />
    </svg>
  );
}

/** Logo bandera: damero 9×5, barra y wordmark (reconstruido a partir del logo oficial). */
export function FlagLogo({ className = "", title = "EGGEO" }) {
  const cell = 27.1;
  const cells = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 9; c++) {
      if ((r + c) % 2 === 1) cells.push(<rect key={`${r}-${c}`} x={13 + c * cell} y={12 + r * cell} width={cell} height={cell} />);
    }
  }
  const [, , ww, wh] = WORDMARK.viewBox.split(" ").map(Number);
  const s = 244 / ww;
  return (
    <svg className={className} viewBox="0 0 270 350" role="img" aria-label={title}>
      <rect className="flag-card" width="270" height="350" rx="12" />
      <g className="flag-ink">
        {cells}
        <rect x="13" y="154" width="244" height="62" />
        <path transform={`translate(13 ${246 + (60 - wh * s) / 2}) scale(${s})`} fillRule="evenodd" d={WORDMARK.d} />
      </g>
    </svg>
  );
}
