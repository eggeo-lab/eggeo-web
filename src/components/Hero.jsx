import React, { useEffect, useRef } from "react";
import { PAGES } from "../content/pages.js";
import { UI } from "../content/site.js";
import { href } from "../routes.js";
import { Arrow } from "./Icons.jsx";
import { ProofBadge } from "./Results.jsx";
import { Picture, LoopVideo } from "../lib/media.jsx";
import { caseById } from "../content/work.js";

/** Huevo frito que reemplaza visualmente a la «O». La yema sigue al cursor y parpadea. */
export function EggEye({ className = "" }) {
  return (
    <svg className={`egg-eye ${className}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="egg-white" d="M50 5C70 3 90 15 94 36C98 56 92 76 77 88C61 99 38 98 22 88C7 77 2 58 6 39C10 19 29 6 50 5Z" />
      <g className="yolk">
        <circle cx="50" cy="50" r="22" />
        <ellipse className="yolk-shine" cx="42" cy="42" rx="7" ry="4.5" transform="rotate(-30 42 42)" />
      </g>
    </svg>
  );
}

/** Un único listener de puntero para paralaje del título y la mirada de los huevos. */
function useHeroPointer(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    el.classList.add("tracking");
    let raf = 0;
    let x = 0;
    let y = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((x - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty("--my", ((y - r.top) / r.height - 0.5).toFixed(3));
      el.querySelectorAll(".egg-eye").forEach((eye) => {
        const b = eye.getBoundingClientRect();
        const dx = x - (b.left + b.width / 2);
        const dy = y - (b.top + b.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 260);
        eye.style.setProperty("--px", ((dx / d) * k).toFixed(3));
        eye.style.setProperty("--py", ((dy / d) * k).toFixed(3));
      });
    };
    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      el.classList.remove("tracking");
    };
  }, [ref]);
}

/** Pila de «reels» del hero: muestra trabajo real en la primera pantalla. */
function HeroStack({ lang }) {
  const heybon = caseById("heybon");
  const slg = caseById("la-gorgona");
  const es = lang === "es";
  return (
    <div className="hero-stack">
      <a className="stack-card s-left" href={href("case:heybon", lang)} aria-label={`${heybon.text[lang].name} — ${es ? "ver caso" : "view case"}`}>
        <Picture id="work/heybon/cover" alt="" sizes="240px" imgClassName="stack-el" />
        <span className="stack-tag">Heybon</span>
      </a>
      <a className="stack-card s-right" href={href("case:la-gorgona", lang)} aria-label={`${slg.text[lang].name} — ${es ? "ver caso" : "view case"}`}>
        <Picture id="work/slg/cover" alt="" sizes="240px" imgClassName="stack-el" />
        <span className="stack-tag">La Gorgona</span>
      </a>
      <a className="stack-card s-center" href={href("work", lang)} aria-label={es ? "Campaña EGGEO — ver todos los proyectos" : "EGGEO campaign — see all work"}>
        <LoopVideo id="campaign/eyes" label="" className="stack-el" />
        <span className="stack-tag">{es ? "Campaña EGGEO" : "EGGEO campaign"}</span>
      </a>
      <ProofBadge lang={lang} />
    </div>
  );
}

export function Hero({ lang }) {
  const P = PAGES[lang].home;
  const t = UI[lang];
  const ref = useRef(null);
  useHeroPointer(ref);
  let n = 0;
  return (
    <section className="hero" ref={ref}>
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="eyebrow hero-eyebrow">{P.eyebrow}</span>
            <span className="sr-only">{P.heroLabel}</span>
            <span className="kt" aria-hidden="true">
              {P.hero.map((word, i) => (
                <span key={word} className="rowK">
                  {[...word].map((ch, j) => {
                    const style = { "--d": `${(i * 0.09 + j * 0.035).toFixed(3)}s` };
                    n++;
                    return ch === "O" ? (
                      <span key={j} className="ch ch-o" style={style}>
                        O
                        <EggEye className={n % 2 ? "" : "late"} />
                      </span>
                    ) : (
                      <span key={j} className="ch" style={style}>
                        {ch}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          </h1>
          <p className="sub-hero">{P.sub}</p>
          <div className="hero-ctas">
            <a className="btn primary" href={href("work", lang)}>
              {t.seeWork} <Arrow />
            </a>
            <a className="btn outline" href={href("contact", lang)}>
              {t.talk}
            </a>
          </div>
        </div>
        <HeroStack lang={lang} />
      </div>
    </section>
  );
}
