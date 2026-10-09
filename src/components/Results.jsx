import React from "react";
import { VIRALS, SERIES, RESULTS_TEXT, TOTAL_PLAYS } from "../content/results.js";
import { href } from "../routes.js";
import { Picture, logoSize } from "../lib/media.jsx";
import { useInViewOnce } from "../lib/hooks.js";
import { fmt } from "../lib/track.js";
import { Counter } from "./Sections.jsx";
import { Arrow } from "./Icons.jsx";

const millions = (n, lang) =>
  `${new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", { maximumFractionDigits: 2 }).format(n / 1e6)} M`;

/** Yemas a escala: el área de cada círculo es proporcional a las reproducciones. */
export function ViralScale({ lang }) {
  const T = RESULTS_TEXT[lang];
  const items = VIRALS.filter((v) => v.metric === "plays");
  const max = Math.max(...items.map((v) => v.value));
  const [ref, seen] = useInViewOnce({ threshold: 0.25 });
  return (
    <figure className={`yolks${seen ? " in" : ""}`} ref={ref}>
      <figcaption className="yolks-cap">
        <span className="eyebrow">{T.scaleTitle}</span>
        <span className="yolks-note">{T.scaleNote}</span>
      </figcaption>
      <ul>
        {items.map((v, i) => (
          <li key={v.id} style={{ "--d": Math.sqrt(v.value / max).toFixed(4), "--i": i }}>
            <span className="yolk-ball" aria-hidden="true">
              <span className="yolk-shine-dot" />
            </span>
            <span className="yolk-num">{millions(v.value, lang)}</span>
            <span className="yolk-client">{v.client}</span>
            <span className="sr-only">
              {fmt(v.value, lang)} {T.labels.plays}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function ViralCards({ lang }) {
  const T = RESULTS_TEXT[lang];
  return (
    <ol className="viral-grid">
      {VIRALS.map((v, i) => {
        const body = (
          <>
            <span className="viral-kicker">
              {lang === "es" ? "Caso" : "Case"} 0{i + 1} · {v.platform}
            </span>
            <span className="viral-num">
              <Counter value={v.value} lang={lang} />
            </span>
            <span className="viral-metric">
              {T.labels[v.metric]}
              {v.period === "60d" ? ` ${T.labels.in60d}` : ""}
            </span>
            <span className="viral-foot">
              <span>
                <strong className="viral-client">{v.client}</strong>
                <span className="viral-sector">{v.sector[lang]}</span>
              </span>
              {v.logo && <Picture id={v.logo} alt="" imgClassName="viral-logo" style={logoSize(v.logo, 40)} />}
            </span>
            <span className="chips">
              {v.chips.map((c) => (
                <span key={c.key} className="chip">
                  {c.value ? `${fmt(c.value, lang, c.compact)} ` : ""}
                  {T.labels[c.key]}
                </span>
              ))}
            </span>
          </>
        );
        return (
          <li key={v.id} className={`viral-card reveal v${i + 1}`}>
            {v.caseId ? (
              <a className="viral-inner" href={href(`case:${v.caseId}`, lang)}>
                {body}
                <span className="viral-more">
                  {lang === "es" ? "Ver caso" : "View case"} <Arrow />
                </span>
              </a>
            ) : (
              <div className="viral-inner">{body}</div>
            )}
          </li>
        );
      })}
      <li className="viral-card viral-cta reveal">
        <a className="viral-inner" href={href("contact", lang)}>
          <span className="viral-kicker">{lang === "es" ? "Caso 06" : "Case 06"}</span>
          <span className="viral-cta-h">{T.cta}</span>
          <span className="viral-more">
            {lang === "es" ? "Hablemos" : "Let's talk"} <Arrow />
          </span>
        </a>
      </li>
    </ol>
  );
}

export function CommonBanner({ lang }) {
  const T = RESULTS_TEXT[lang];
  return (
    <section className="common" aria-labelledby="common-h">
      <div className="container">
        <h2 id="common-h" className="common-h">
          {T.commonTitle[0]} <mark>{T.commonTitle[1]}</mark>
          <span className="common-sub">{T.commonText}</span>
        </h2>
      </div>
    </section>
  );
}

/** Serie «Gata vs Gata»: views por capítulo con reacciones y compartidos. */
export function SeriesChart({ lang, compact = false }) {
  const T = RESULTS_TEXT[lang];
  const max = Math.max(...SERIES.map((s) => s.views));
  const growth = Math.round((SERIES[SERIES.length - 1].views / SERIES[0].views - 1) * 100);
  const [ref, seen] = useInViewOnce({ threshold: 0.3 });
  return (
    <figure className={`series${seen ? " in" : ""}${compact ? " compact" : ""}`} ref={ref}>
      <figcaption>
        <span className="eyebrow">{T.seriesKicker}</span>
        <span className="series-title">{T.seriesTitle}</span>
        {!compact && <span className="series-text">{T.seriesText}</span>}
      </figcaption>
      <ol className="series-rows">
        {SERIES.map((s, i) => (
          <li key={s.ep} style={{ "--w": ((s.views / max) * 100).toFixed(2) + "%", "--i": i }}>
            <span className="series-ep">
              <small>{T.chapter}</small>
              {s.ep}
            </span>
            <span className="series-track">
              <span className="series-bar" />
              <span className="series-views">
                {fmt(s.views, lang)} <small>{T.views}</small>
              </span>
            </span>
            <span className="series-meta">
              <span>
                <strong>{fmt(s.reactions, lang)}</strong> {T.reactions}
              </span>
              <span>
                <strong>{fmt(s.shares, lang)}</strong> {T.sharesShort}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p className="series-growth">
        <strong>+{growth}%</strong> {lang === "es" ? "de views del capítulo 01 al 04" : "views from episode 01 to 04"}
      </p>
      <p className="source">{T.seriesNote}</p>
    </figure>
  );
}

/** Sello giratorio del hero con la prueba principal. */
export function ProofBadge({ lang }) {
  const T = RESULTS_TEXT[lang];
  const text =
    lang === "es"
      ? `5 VIRALES · ${millions(TOTAL_PLAYS, lang)} DE REPRODUCCIONES · SIN INFLUENCERS · `
      : `5 VIRAL HITS · ${millions(TOTAL_PLAYS, lang)} PLAYS · NO INFLUENCERS · `;
  return (
    <a className="proof-badge" href={href("results", lang)} aria-label={`${text.replace(/ · $/, "")} — ${T.homeLink}`}>
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <defs>
          <path id={`badge-circle-${lang}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" className="badge-bg" />
        <g className="badge-spin">
          <text className="badge-text">
            <textPath href={`#badge-circle-${lang}`} textLength="486" lengthAdjust="spacingAndGlyphs">
              {text}
            </textPath>
          </text>
        </g>
        <path className="badge-white" d="M100 58C116 56 132 66 135 83C139 99 134 116 122 125C109 135 90 134 77 126C65 117 61 102 64 86C67 70 83 59 100 58Z" />
        <circle className="badge-yolk" cx="100" cy="96" r="17" />
      </svg>
    </a>
  );
}

/** Bloque de resultados para el inicio. */
export function ResultsTeaser({ lang }) {
  const T = RESULTS_TEXT[lang];
  return (
    <section className="sec results-teaser" aria-labelledby="rt-h">
      <div className="container">
        <div className="sec-top">
          <div>
            <p className="eyebrow">{T.homeKicker}</p>
            <h2 id="rt-h" className="sec-h">
              {T.homeTitle}
            </h2>
          </div>
          <p className="sec-intro">
            <span className="rt-total">
              <Counter value={TOTAL_PLAYS} lang={lang} />
            </span>{" "}
            {T.totalLabel}. {T.intro}
          </p>
        </div>
        <ViralScale lang={lang} />
        <div className="sec-more">
          <a className="btn primary" href={href("results", lang)}>
            {T.homeLink} <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
