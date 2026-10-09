import React, { useEffect, useRef, useState } from "react";
import { UI, waLink } from "../content/site.js";
import { CLIENTS, PAGES, TEAM } from "../content/pages.js";
import { CASES, STAT_LABELS, caseById } from "../content/work.js";
import { SERVICES } from "../content/services.js";
import { href } from "../routes.js";
import { Picture, LoopVideo, logoSize, mediaInfo } from "../lib/media.jsx";
import { useInViewOnce, usePrefersReducedMotion } from "../lib/hooks.js";
import { fmt, track } from "../lib/track.js";
import { Arrow, ArrowUpRight, Pause, Play, WhatsApp } from "./Icons.jsx";
import { EggEye } from "./Hero.jsx";

/* ---------------- Clientes ---------------- */
export function ClientMarquee({ lang, title = true }) {
  const t = UI[lang];
  const [paused, setPaused] = useState(false);
  return (
    <section className={`clients${paused ? " paused" : ""}`} aria-labelledby="clients-h">
      <div className="container clients-head">
        <h2 id="clients-h" className={`eyebrow${title ? "" : " sr-only"}`}>
          {t.clientsTitle}
        </h2>
        <button type="button" className="marquee-toggle" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? t.playMotion : t.pauseMotion}>
          {paused ? <Play /> : <Pause />}
        </button>
      </div>
      <div className="marquee">
        <ul className="marquee-track">
          {[0, 1].map((copy) =>
            CLIENTS.map((c) => (
              <li key={`${copy}-${c.name}`} aria-hidden={copy ? "true" : undefined}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined} className="client">
                  <Picture id={c.logo} alt={copy ? "" : `${c.name} ${t.newTab}`} imgClassName="client-logo" style={logoSize(c.logo)} />
                </a>
              </li>
            )),
          )}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Proyectos ---------------- */
function useTilt() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg");
        el.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);
  return ref;
}

export function WorkCard({ c, lang, size = "", priority = false, heading = "h3" }) {
  const H = heading;
  const t = c.text[lang];
  const ref = useTilt();
  // Con object-fit: cover una foto horizontal en un marco 4:5 se dibuja más ancha que la tarjeta.
  const m = mediaInfo(c.cover);
  const crop = m.video ? 1 : Math.max(1, m.w / m.h / (size === "wide" ? 16 / 10 : 4 / 5));
  const base = size === "wide" ? 640 : 420;
  const media = c.teaser ? (
    <LoopVideo id={c.teaser} label={c.alt[c.teaser]?.[lang] || t.name} className="work-media-el" />
  ) : (
    <Picture
      id={c.cover}
      alt={c.alt[c.cover]?.[lang] || t.name}
      sizes={`(max-width: 900px) ${Math.round(92 * crop)}vw, (max-width: 1100px) ${Math.round(46 * crop)}vw, ${Math.round(base * crop)}px`}
      priority={priority}
      imgClassName="work-media-el"
    />
  );
  return (
    <article className={`work-card reveal ${size}`} ref={ref} style={{ "--tone": c.tone.bg, "--tone-fg": c.tone.fg }}>
      <a className="work-link" href={href(`case:${c.id}`, lang)}>
        <div className="work-media">{media}</div>
        <div className="work-info">
          <p className="work-sector">{t.sector}</p>
          <H className="work-title">{t.name}</H>
          <p className="work-summary">{t.summary}</p>
          <ul className="tags" aria-label={UI[lang].services}>
            {t.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
        <span className="work-arrow" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </a>
    </article>
  );
}

export function WorkGrid({ lang, ids, heading = "h3" }) {
  const list = ids ? ids.map(caseById) : CASES;
  return (
    <div className="work-grid">
      {list.map((c) => (
        <WorkCard key={c.id} c={c} lang={lang} heading={heading} />
      ))}
    </div>
  );
}

/* ---------------- Datos ---------------- */
export function Counter({ value, lang, suffix = "", compact = false }) {
  const reduced = usePrefersReducedMotion();
  const [ref, seen] = useInViewOnce({ threshold: 0.6 });
  const [shown, setShown] = useState(value);
  const armed = useRef(false);

  useEffect(() => {
    // Solo se anima si arranca fuera de pantalla; el HTML prerenderizado muestra el valor real.
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight) {
      armed.current = true;
      setShown(0);
    }
  }, [reduced]);

  useEffect(() => {
    if (!seen || !armed.current) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setShown(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);

  return (
    <span ref={ref} className="counter">
      {fmt(shown, lang, compact)}
      {suffix}
    </span>
  );
}

export function StatGrid({ items, lang }) {
  const L = STAT_LABELS[lang];
  return (
    <dl className="stat-grid">
      {items.map((s) => (
        <div key={s.key} className="stat reveal">
          <dt>{L[s.key]}</dt>
          <dd>
            <Counter value={s.value} lang={lang} compact={s.compact} suffix={s.unit === "d" ? (lang === "es" ? " días" : " days") : ""} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Barras 3D (prismas CSS) con escala lineal y valores visibles. */
export function Bars3D({ bars, lang, title }) {
  const L = STAT_LABELS[lang];
  const max = Math.max(...bars.map((b) => b.value));
  const [ref, seen] = useInViewOnce({ threshold: 0.3 });
  return (
    <figure className={`bars3d${seen ? " in" : ""}`} ref={ref}>
      <figcaption className="eyebrow">{title}</figcaption>
      <ul>
        {bars.map((b, i) => (
          <li key={b.key} style={{ "--h": Math.max(2.5, (b.value / max) * 100).toFixed(2), "--i": i }}>
            <span className="bar" aria-hidden="true">
              <span className="bar-front" />
              <span className="bar-side" />
              <span className="bar-top" />
            </span>
            <span className="bar-value">{fmt(b.value, lang)}</span>
            <span className="bar-label">{L[b.key]}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function SplitBar({ split, lang, title, note }) {
  const L = STAT_LABELS[lang];
  const pct = (split.organic / split.total) * 100;
  const [ref, seen] = useInViewOnce({ threshold: 0.4 });
  return (
    <figure className={`split${seen ? " in" : ""}`} ref={ref}>
      <figcaption>
        <span className="eyebrow">{title}</span>
        <span className="split-total">
          <strong>{fmt(split.total, lang)}</strong> {L.total}
        </span>
      </figcaption>
      <div className="split-bar" role="img" aria-label={`${L.organic}: ${fmt(split.organic, lang)}. ${L.paid}: ${fmt(split.paid, lang)}.`}>
        <span className="split-a" style={{ "--w": pct.toFixed(2) + "%" }} />
        <span className="split-b" style={{ "--w": (100 - pct).toFixed(2) + "%" }} />
      </div>
      <div className="split-legend" aria-hidden="true">
        <span>
          <i className="dot-a" /> {L.organic} · {fmt(split.organic, lang)}
        </span>
        <span>
          <i className="dot-b" /> {L.paid} · {fmt(split.paid, lang)}
        </span>
      </div>
      <p className="source">{note}</p>
    </figure>
  );
}

/* ---------------- Manifiesto: Absurdo / Serio ---------------- */
export function Manifesto({ lang }) {
  const M = PAGES[lang].home.manifesto;
  return (
    <section className="manifesto" aria-label={`${M.absurdTitle} / ${M.seriousTitle}`}>
      <div className="mf-absurd">
        <div className="mf-text reveal">
          <h2 className="mf-h">
            {M.absurdTitle.split(" ")[0]}
            <br />
            {M.absurdTitle.split(" ").slice(1).join(" ")}
          </h2>
          <p>{M.absurdText}</p>
        </div>
        <div className="mf-media reveal">
          <LoopVideo id="campaign/eyes" label={lang === "es" ? "Campaña «Mirá con los ojos de EGGEO»: personas con huevos fritos en lugar de ojos" : "«See through EGGEO's eyes» campaign: people with fried eggs for eyes"} className="mf-video" />
          <LoopVideo id="campaign/ia" label={lang === "es" ? "Retrato con huevos fritos en los ojos, de la campaña de EGGEO" : "Portrait with fried eggs over the eyes, from EGGEO's campaign"} className="mf-video mf-video-2" />
        </div>
      </div>
      <div className="mf-serious">
        <div className="mf-text reveal">
          <h2 className="mf-h">
            {M.seriousTitle.split(" ")[0]}
            <br />
            {M.seriousTitle.split(" ").slice(1).join(" ")}
          </h2>
          <p>{M.seriousText}</p>
        </div>
        <ul className="mf-stats">
          {M.stats.map((s) => (
            <li key={s.label} className="reveal">
              <a href={href(s.href, lang)} className="mf-stat">
                <span className="mf-num">
                  <Counter value={s.value} lang={lang} />
                </span>
                <span className="mf-label">{s.label}</span>
                <span className="source">{s.note}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="btn mf-more" href={href("results", lang)}>
          {M.more} <Arrow />
        </a>
      </div>
    </section>
  );
}

/* ---------------- Servicios ---------------- */
export function ServiceList({ lang, heading = "h3" }) {
  const H = heading;
  return (
    <ol className="svc-list">
      {SERVICES.map((s, i) => {
        const t = s.text[lang];
        return (
          <li key={s.id} className="reveal">
            <a className="svc-row" href={href(`service:${s.id}`, lang)}>
              <span className="svc-num" aria-hidden="true">
                0{i + 1}
              </span>
              <H className="svc-name">{t.name}</H>
              <span className="svc-short">{t.short}</span>
              {s.thumb && (
                <span className="svc-thumb" aria-hidden="true">
                  <Picture id={s.thumb} alt="" sizes="200px" />
                </span>
              )}
              <span className="svc-arrow" aria-hidden="true">
                <Arrow />
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function Process({ lang }) {
  const P = PAGES[lang].home;
  return (
    <section className="sec process" aria-labelledby="process-h">
      <div className="container">
        <h2 id="process-h" className="sec-h">
          {P.processTitle}
        </h2>
        <ol className="process-list">
          {P.process.map((s, i) => (
            <li key={s.t} className="reveal" style={{ "--i": i }}>
              <span className="process-egg" aria-hidden="true">
                <EggEye />
              </span>
              <span className="process-num" aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TeamGrid({ lang }) {
  return (
    <ul className="team-grid">
      {TEAM.map((m) => (
        <li key={m.name} className="team-card reveal">
          <span className="team-initials" aria-hidden="true">
            {m.name
              .split(" ")
              .map((w) => w[0])
              .join("")}
          </span>
          <h3>{m.name}</h3>
          <p className="role">{m.role[lang]}</p>
          <p>{m.bio[lang]}</p>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- CTA con bandera a cuadros 3D ---------------- */
export function CheckerFlag() {
  const cols = 12;
  const rows = 8;
  return (
    <div className="flag3d" aria-hidden="true">
      <div className="flag-pole" />
      <div className="flag-cloth">
        {Array.from({ length: cols }, (_, c) => (
          <div key={c} className="flag-col" style={{ "--c": c }}>
            {Array.from({ length: rows }, (_, r) => (
              <span key={r} className={(r + c) % 2 ? "sq on" : "sq"} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CtaBlock({ lang }) {
  const P = PAGES[lang].home;
  const t = UI[lang];
  return (
    <section className="cta" aria-labelledby="cta-h">
      <div className="container cta-grid">
        <div className="cta-copy">
          <h2 id="cta-h" className="cta-h">
            {P.ctaTitle[0]}
            <br />
            <span className="hl">{P.ctaTitle[1]}</span>
          </h2>
          <p>{P.ctaText}</p>
          <div className="cta-actions">
            <a className="btn primary on-yellow" href={href("contact", lang)} onClick={() => track("cta_click", { place: "cta" })}>
              {t.talk} <Arrow />
            </a>
            <a className="btn wa" href={waLink(lang)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { place: "cta" })}>
              <WhatsApp /> WhatsApp
              <span className="sr-only"> {t.newTab}</span>
            </a>
          </div>
        </div>
        <CheckerFlag />
      </div>
    </section>
  );
}

export function Breadcrumbs({ items, lang }) {
  return (
    <nav className="crumbs" aria-label={UI[lang].breadcrumb}>
      <ol>
        {items.map((c, i) => (
          <li key={c.path}>
            {i < items.length - 1 ? <a href={c.path}>{c.name}</a> : <span aria-current="page">{c.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

