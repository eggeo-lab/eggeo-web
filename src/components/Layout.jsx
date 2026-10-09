import React, { useCallback, useEffect, useState } from "react";
import { UI, ORG, waLink } from "../content/site.js";
import { SERVICES } from "../content/services.js";
import { href } from "../routes.js";
import { HeaderLogo, FlagLogo } from "./Brand.jsx";
import { Sun, Moon, Burger, Close, WhatsApp, ArrowUpRight, Arrow } from "./Icons.jsx";
import { useFocusTrap } from "../lib/hooks.js";
import { track } from "../lib/track.js";

const NAV = ["work", "results", "services", "agency", "contact"];

function isCurrent(route, key) {
  return route.key === key || route.parent === key;
}

function ThemeToggle({ label }) {
  const toggle = () => {
    const d = document.documentElement;
    const next = d.getAttribute("data-theme") === "dark" ? "light" : "dark";
    d.setAttribute("data-theme", next);
    try {
      localStorage.setItem("eggeo-theme", next);
    } catch (_) {}
  };
  return (
    <button type="button" className="btn-icon" onClick={toggle} aria-label={label}>
      <Moon />
      <Sun />
    </button>
  );
}

function LangLink({ route, t }) {
  const other = route.lang === "es" ? "en" : "es";
  const to = route.alternates ? route.alternates[other] : href("home", other);
  return (
    <a className="btn-icon lang" href={to} hrefLang={other} lang={other} aria-label={`${t.langShort} — ${t.langSwitch}`}>
      {t.langShort}
    </a>
  );
}

export function Header({ route }) {
  const t = UI[route.lang];
  const [open, setOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const trapRef = useFocusTrap(open, close);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShrunk(window.scrollY > 40));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <header className={`hd${shrunk ? " shrunk" : ""}`}>
        <div className="container bar">
          <a className="logo-link" href={href("home", route.lang)} aria-label={`EGGEO — ${t.home}`}>
            <HeaderLogo className="hd-logo" />
          </a>
          <nav className="nav-desk" aria-label={t.menu}>
            {NAV.map((k) => (
              <a key={k} className="nav-link" href={href(k, route.lang)} aria-current={isCurrent(route, k) ? "page" : undefined}>
                {t.nav[k]}
              </a>
            ))}
          </nav>
          <div className="actions">
            <a className="hd-cta" href={href("contact", route.lang)} onClick={() => track("cta_click", { place: "header" })}>
              {t.talk} <Arrow />
            </a>
            <LangLink route={route} t={t} />
            <ThemeToggle label={t.themeToggle} />
            <button
              type="button"
              className="btn-icon burger"
              aria-expanded={open}
              aria-controls="mnav"
              aria-label={t.menuOpen}
              onClick={() => setOpen(true)}
            >
              <Burger />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mnav"
        className={`mnav${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t.menu}
        hidden={!open}
        ref={trapRef}
      >
        <button type="button" className="mnav-close" onClick={close} aria-label={t.menuClose}>
          <Close />
        </button>
        <nav className="mobile-links" aria-label={t.menu}>
          {NAV.map((k, i) => (
            <a key={k} className="m-link" href={href(k, route.lang)} aria-current={isCurrent(route, k) ? "page" : undefined}>
              {t.nav[k]} <span aria-hidden="true">0{i + 1}</span>
            </a>
          ))}
        </nav>
        <a className="m-wa" href={waLink(route.lang)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { place: "menu" })}>
          <WhatsApp /> {t.whatsapp}
          <span className="sr-only"> {t.newTab}</span>
        </a>
      </div>
    </>
  );
}

export function Footer({ route }) {
  const { lang } = route;
  const t = UI[lang];
  return (
    <footer className="ft">
      <div className="container ft-grid">
        <div className="ft-brand">
          <a href={href("home", lang)} className="ft-flag" aria-label={`EGGEO — ${t.home}`}>
            <FlagLogo title="EGGEO" />
          </a>
          <p className="ft-tag">{ORG.tagline[lang]}.</p>
          <p className="ft-desc">{t.footerTag}</p>
        </div>
        <nav className="ft-col" aria-label={t.footerNav}>
          <h2 className="ft-h">{t.footerNav}</h2>
          {NAV.map((k) => (
            <a key={k} href={href(k, lang)}>
              {t.nav[k]}
            </a>
          ))}
        </nav>
        <nav className="ft-col" aria-label={t.footerServices}>
          <h2 className="ft-h">{t.footerServices}</h2>
          {SERVICES.map((s) => (
            <a key={s.id} href={href(`service:${s.id}`, lang)}>
              {s.text[lang].name}
            </a>
          ))}
        </nav>
        <div className="ft-col">
          <h2 className="ft-h">{t.footerContact}</h2>
          <a href={waLink(lang)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { place: "footer" })}>
            WhatsApp <ArrowUpRight />
            <span className="sr-only"> {t.newTab}</span>
          </a>
          {ORG.social.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label} <ArrowUpRight />
              <span className="sr-only"> {t.newTab}</span>
            </a>
          ))}
          <a href={route.alternates ? route.alternates[lang === "es" ? "en" : "es"] : href("home", lang === "es" ? "en" : "es")} hrefLang={lang === "es" ? "en" : "es"}>
            {t.langSwitch}
          </a>
        </div>
      </div>
      <div className="container ft-bottom">
        <span suppressHydrationWarning>© {new Date().getFullYear()} EGGEO</span>
        <span>{t.rights}</span>
      </div>
      <div className="checker-strip" aria-hidden="true" />
    </footer>
  );
}

export function WhatsAppFloat({ lang }) {
  return (
    <a
      className="wa-float"
      href={waLink(lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${UI[lang].whatsapp} ${UI[lang].newTab}`}
      onClick={() => track("whatsapp_click", { place: "float" })}
    >
      <WhatsApp />
    </a>
  );
}
