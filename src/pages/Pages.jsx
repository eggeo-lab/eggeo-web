import React from "react";
import { UI } from "../content/site.js";
import { PAGES } from "../content/pages.js";
import { CASES, caseById } from "../content/work.js";
import { SERVICES, serviceById } from "../content/services.js";
import { href } from "../routes.js";
import { breadcrumbs } from "../seo/head.js";
import { Picture, LoopVideo, FilmPlayer } from "../lib/media.jsx";
import { Hero, EggEye } from "../components/Hero.jsx";
import {
  ClientMarquee,
  WorkGrid,
  WorkCard,
  Manifesto,
  ServiceList,
  Process,
  TeamGrid,
  CtaBlock,
  Breadcrumbs,
  StatGrid,
  Bars3D,
  SplitBar,
  Counter,
} from "../components/Sections.jsx";
import { ContactForm, Packs, Faq } from "../components/Forms.jsx";
import { ViralScale, ViralCards, CommonBanner, SeriesChart } from "../components/Results.jsx";
import { RESULTS_TEXT, TOTAL_PLAYS } from "../content/results.js";
import { Arrow } from "../components/Icons.jsx";

function PageHead({ route, title, intro, children }) {
  return (
    <header className="page-head">
      <div className="container">
        <Breadcrumbs items={breadcrumbs(route)} lang={route.lang} />
        <h1 className="page-h1">{title}</h1>
        {intro && <p className="page-intro">{intro}</p>}
        {children}
      </div>
    </header>
  );
}

/* ---------------- Inicio ---------------- */
export function Home({ route }) {
  const { lang } = route;
  const P = PAGES[lang].home;
  const t = UI[lang];
  return (
    <>
      <Hero lang={lang} />
      <ClientMarquee lang={lang} />
      <section className="sec work-sec" aria-labelledby="work-h">
        <div className="container">
          <div className="sec-top">
            <h2 id="work-h" className="sec-h">
              {P.workTitle}
            </h2>
            <p className="sec-intro">{P.workIntro}</p>
          </div>
          <WorkGrid lang={lang} />
          <div className="sec-more">
            <a className="btn outline" href={href("work", lang)}>
              {t.allWork} <Arrow />
            </a>
          </div>
        </div>
      </section>
      <Manifesto lang={lang} />
      <section className="sec" aria-labelledby="svc-h">
        <div className="container">
          <h2 id="svc-h" className="sec-h">
            {P.servicesTitle}
          </h2>
          <ServiceList lang={lang} />
        </div>
      </section>
      <Process lang={lang} />
      <section className="sec team-sec" aria-labelledby="team-h">
        <div className="container">
          <div className="sec-top">
            <h2 id="team-h" className="sec-h inv">
              {P.teamTitle}
            </h2>
            <p className="sec-intro">{P.teamText}</p>
          </div>
          <TeamGrid lang={lang} />
          <div className="sec-more">
            <a className="btn ghost-light" href={href("agency", lang)}>
              {t.nav.agency} <Arrow />
            </a>
          </div>
        </div>
      </section>
      <CtaBlock lang={lang} />
    </>
  );
}

/* ---------------- Servicios ---------------- */
export function Services({ route }) {
  const { lang } = route;
  const P = PAGES[lang].services;
  return (
    <>
      <PageHead route={route} title={P.h1} intro={P.intro} />
      <section className="sec sec-tight" aria-label={P.h1}>
        <div className="container">
          <ServiceList lang={lang} heading="h2" />
        </div>
      </section>
      <Packs lang={lang} />
      <CtaBlock lang={lang} />
    </>
  );
}

export function Service({ route }) {
  const { lang } = route;
  const s = serviceById(route.param);
  const t = s.text[lang];
  const ui = UI[lang];
  const others = SERVICES.filter((x) => x.id !== s.id);
  return (
    <>
      <PageHead route={route} title={t.h1} intro={t.intro}>
        <p className="page-kicker">{t.name}</p>
      </PageHead>
      <section className="sec sec-tight" aria-labelledby="deliv-h">
        <div className="container two-col">
          <h2 id="deliv-h" className="sec-h sm">
            {lang === "es" ? "Qué incluye" : "What's included"}
          </h2>
          <ul className="deliverables">
            {t.deliverables.map((d) => (
              <li key={d} className="reveal">
                <EggEye />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>
      {s.cases.length > 0 && (
        <section className="sec" aria-labelledby="rel-h">
          <div className="container">
            <h2 id="rel-h" className="sec-h sm">
              {ui.relatedWork}
            </h2>
            <WorkGrid lang={lang} ids={s.cases} />
          </div>
        </section>
      )}
      {s.id === "content" && <Packs lang={lang} />}
      <section className="sec sec-tight" aria-labelledby="faq-h">
        <div className="container two-col">
          <h2 id="faq-h" className="sec-h sm">
            {lang === "es" ? "Preguntas frecuentes" : "FAQ"}
          </h2>
          <Faq items={t.faqs} lang={lang} />
        </div>
      </section>
      <section className="sec sec-tight" aria-labelledby="other-h">
        <div className="container">
          <h2 id="other-h" className="eyebrow">
            {lang === "es" ? "Otros servicios" : "Other services"}
          </h2>
          <ul className="chip-links">
            {others.map((o) => (
              <li key={o.id}>
                <a href={href(`service:${o.id}`, lang)}>{o.text[lang].name}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBlock lang={lang} />
    </>
  );
}

/* ---------------- Proyectos ---------------- */
export function Work({ route }) {
  const { lang } = route;
  const P = PAGES[lang].work;
  return (
    <>
      <PageHead route={route} title={P.h1} intro={P.intro} />
      <section className="sec sec-tight" aria-label={P.h1}>
        <div className="container">
          <WorkGrid lang={lang} heading="h2" />
        </div>
      </section>
      <ClientMarquee lang={lang} />
      <CtaBlock lang={lang} />
    </>
  );
}

function CaseHero({ c, lang }) {
  const t = c.text[lang];
  const ui = UI[lang];
  const cover = c.teaser ? (
    <LoopVideo id={c.teaser} label={c.alt[c.teaser]?.[lang] || t.name} className="case-cover-el" />
  ) : (
    <Picture id={c.cover} alt={c.alt[c.cover]?.[lang] || t.name} sizes="(max-width: 900px) 92vw, 600px" priority imgClassName="case-cover-el" />
  );
  return (
    <div className="case-hero-grid">
      <div className="case-hero-copy">
        <p className="eyebrow">{t.sector}</p>
        <h1 className="case-h1">{t.h1}</h1>
        <p className="case-intro">{t.intro}</p>
        <dl className="case-facts">
          <div>
            <dt>{ui.client}</dt>
            <dd>{c.client}</dd>
          </div>
          <div>
            <dt>{ui.role}</dt>
            <dd>{t.role}</dd>
          </div>
          <div>
            <dt>{ui.services}</dt>
            <dd>
              {c.services.map((id, i) => (
                <React.Fragment key={id}>
                  {i > 0 && " · "}
                  <a href={href(`service:${id}`, lang)}>{serviceById(id).text[lang].name}</a>
                </React.Fragment>
              ))}
            </dd>
          </div>
        </dl>
      </div>
      <div className="case-cover">{cover}</div>
    </div>
  );
}

export function Case({ route }) {
  const { lang } = route;
  const c = caseById(route.param);
  const t = c.text[lang];
  const ui = UI[lang];
  const idx = CASES.findIndex((x) => x.id === c.id);
  const next = CASES[(idx + 1) % CASES.length];
  const alt = (id) => c.alt[id]?.[lang] || t.name;
  return (
    <article className="case" style={{ "--tone": c.tone.bg, "--tone-fg": c.tone.fg, "--tone-accent": c.tone.accent }}>
      <header className="case-hero">
        <div className="container">
          <Breadcrumbs items={breadcrumbs(route)} lang={lang} />
          <CaseHero c={c} lang={lang} />
        </div>
      </header>

      <section className="sec case-story" aria-label={lang === "es" ? "La idea y la ejecución" : "Idea and execution"}>
        <div className="container two-col">
          <div className="reveal">
            <h2 className="sec-h sm">{lang === "es" ? "La idea" : "The idea"}</h2>
            <p className="lead">{t.idea}</p>
          </div>
          <div className="reveal">
            <h2 className="sec-h sm">{lang === "es" ? "Qué hicimos" : "What we did"}</h2>
            <ul className="deliverables">
              {t.execution.map((d) => (
                <li key={d}>
                  <EggEye />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {c.palette && (
        <section className="sec sec-tight" aria-labelledby="pal-h">
          <div className="container">
            <h2 id="pal-h" className="eyebrow">
              {lang === "es" ? "Paleta" : "Palette"}
            </h2>
            <ul className="palette">
              {c.palette.map((p) => (
                <li key={p.hex} className="reveal" style={{ "--sw": p.hex }}>
                  <span className="swatch" aria-hidden="true" />
                  <span className="sw-hex">{p.hex}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {c.films && (
        <section className="sec sec-tight case-film" aria-labelledby="film-h">
          <div className="container">
            <h2 id="film-h" className="sec-h sm">
              {c.films.length > 1 ? (lang === "es" ? "Las piezas" : "The pieces") : lang === "es" ? "La pieza" : "The film"}
            </h2>
            <ul className={`films n${c.films.length}`}>
              {c.films.map((f) => (
                <li key={f.id}>
                  <FilmPlayer id={f.id} label={alt(f.id)} playLabel={ui.playVideo} />
                  <p className="film-title">{f.title[lang]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {c.gallery.length > 0 && (
        <section className="sec sec-tight" aria-label={lang === "es" ? "Galería" : "Gallery"}>
          <div className="container">
            <ul className="gallery">
              {c.gallery.map((g) => (
                <li key={g.id} className={`reveal ${g.span || ""} ${g.tall ? "tall" : ""}`}>
                  {g.video ? (
                    <LoopVideo id={g.id} label={alt(g.id)} className="gal-el" />
                  ) : (
                    <Picture id={g.id} alt={alt(g.id)} sizes="(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 400px" imgClassName="gal-el" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {c.stats && (
        <section className="sec case-stats" aria-labelledby="stats-h">
          <div className="container">
            <h2 id="stats-h" className="sec-h sm">
              {t.statsTitle}
            </h2>
            <StatGrid items={c.stats.highlight} lang={lang} />
            <p className="source">
              {ui.source}: {t.statsNote}
            </p>
            {c.stats.bars && <Bars3D bars={c.stats.bars} lang={lang} title={t.barsTitle} />}
            {c.stats.split && <SplitBar split={c.stats.split} lang={lang} title={t.splitTitle} note={`${ui.source}: ${t.splitNote}`} />}
          </div>
        </section>
      )}

      {c.series && (
        <section className="sec case-series" aria-label={RESULTS_TEXT[lang].seriesKicker}>
          <div className="container">
            <SeriesChart lang={lang} />
          </div>
        </section>
      )}

      <section className="sec sec-tight" aria-labelledby="res-h">
        <div className="container two-col">
          <h2 id="res-h" className="sec-h sm">
            {lang === "es" ? "El resultado" : "The result"}
          </h2>
          <p className="lead reveal">{t.result}</p>
        </div>
      </section>

      <section className="sec next-case" aria-labelledby="next-h">
        <div className="container">
          <h2 id="next-h" className="eyebrow">
            {ui.nextCase}
          </h2>
          <WorkCard c={next} lang={lang} size="wide" />
        </div>
      </section>
      <CtaBlock lang={lang} />
    </article>
  );
}

/* ---------------- Resultados ---------------- */
export function Results({ route }) {
  const { lang } = route;
  const T = RESULTS_TEXT[lang];
  return (
    <>
      <header className="results-hero">
        <div className="checker-band" aria-hidden="true" />
        <div className="container">
          <Breadcrumbs items={breadcrumbs(route)} lang={lang} />
          <p className="eyebrow">{lang === "es" ? "Casos reales · Córdoba, Argentina" : "Real cases · Córdoba, Argentina"}</p>
          <h1 className="page-h1 results-h1">
            {T.h1Parts[0]} <mark>{T.h1Parts[1]}</mark> {T.h1Parts[2]}
          </h1>
          <p className="page-intro">{T.intro}</p>
          <p className="results-total">
            <span className="results-total-num">
              <Counter value={TOTAL_PLAYS} lang={lang} />
            </span>
            <span>{T.totalLabel}</span>
          </p>
        </div>
      </header>
      <section className="sec yolk-sec" aria-label={T.scaleTitle}>
        <div className="container">
          <ViralScale lang={lang} />
        </div>
      </section>
      <section className="sec" aria-label={lang === "es" ? "Los cinco casos" : "The five cases"}>
        <div className="container">
          <ViralCards lang={lang} />
          <p className="source">{T.sourceNote}</p>
        </div>
      </section>
      <CommonBanner lang={lang} />
      <section className="sec" aria-label={T.seriesKicker}>
        <div className="container">
          <SeriesChart lang={lang} />
          <div className="sec-more">
            <a className="btn outline" href={href("case:gata-maula", lang)}>
              {lang === "es" ? "Ver el caso Gata Maula" : "View the Gata Maula case"} <Arrow />
            </a>
          </div>
        </div>
      </section>
      <CtaBlock lang={lang} />
    </>
  );
}

/* ---------------- Agencia ---------------- */
export function Agency({ route }) {
  const { lang } = route;
  const A = PAGES[lang].agency;
  return (
    <>
      <PageHead route={route} title={A.h1} intro={A.lead} />
      <section className="sec sec-tight" aria-label={A.h1}>
        <div className="container two-col">
          <div className="prose">
            {A.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div>
            <h2 className="eyebrow">{A.factsTitle}</h2>
            <dl className="facts">
              {A.facts.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="sec team-sec" aria-labelledby="team-h">
        <div className="container">
          <h2 id="team-h" className="sec-h inv">
            {A.teamTitle}
          </h2>
          <TeamGrid lang={lang} />
        </div>
      </section>
      <section className="sec" aria-labelledby="values-h">
        <div className="container">
          <h2 id="values-h" className="sec-h">
            {A.valuesTitle}
          </h2>
          <ol className="values">
            {A.values.map((v) => (
              <li key={v.t} className="reveal">
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Process lang={lang} />
      <ClientMarquee lang={lang} />
      <CtaBlock lang={lang} />
    </>
  );
}

/* ---------------- Contacto ---------------- */
export function Contact({ route }) {
  const { lang } = route;
  const C = PAGES[lang].contact;
  return (
    <>
      <PageHead route={route} title={C.h1} intro={C.intro} />
      <section className="sec sec-tight" aria-label={C.h1}>
        <div className="container contact-grid">
          <ContactForm lang={lang} />
          <aside className="contact-aside" aria-label={C.altTitle}>
            <EggEye className="contact-egg" />
            <p className="eyebrow">{C.altTitle}</p>
            <ul className="chip-links">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a href={href(`service:${s.id}`, lang)}>{s.text[lang].name}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ---------------- 404 (bilingüe) ---------------- */
export function NotFound() {
  const es = PAGES.es.notFound;
  const en = PAGES.en.notFound;
  return (
    <section className="nf">
      <div className="container">
        <div className="nf-egg" aria-hidden="true">
          <span>4</span>
          <EggEye />
          <span>4</span>
        </div>
        <h1 className="page-h1">{es.h1}</h1>
        <p className="page-intro">{es.text}</p>
        <p className="page-intro" lang="en">
          {en.text}
        </p>
        <div className="hero-ctas">
          <a className="btn primary" href={href("home", "es")}>
            {UI.es.home} <Arrow />
          </a>
          <a className="btn outline" href={href("work", "es")}>
            {UI.es.seeWork}
          </a>
          <a className="btn outline" href={href("home", "en")} lang="en" hrefLang="en">
            English
          </a>
        </div>
      </div>
    </section>
  );
}

