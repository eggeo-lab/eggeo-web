import React, { useState } from "react";
import { ORG, UI, waLink } from "../content/site.js";
import { PAGES } from "../content/pages.js";
import { SERVICES, PACKS } from "../content/services.js";
import { href } from "../routes.js";
import { track } from "../lib/track.js";
import { Arrow, WhatsApp } from "./Icons.jsx";

export function ContactForm({ lang, preset = "" }) {
  const F = PAGES[lang].contact.form;
  const [status, setStatus] = useState("idle");

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    try {
      const res = await fetch(ORG.formspree, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("ok");
      form.reset();
      track("generate_lead", { method: "form" });
    } catch (_) {
      setStatus("error");
    }
  }

  return (
    <form className="form" action={ORG.formspree} method="POST" onSubmit={onSubmit} noValidate={false}>
      <input type="hidden" name="_subject" value={lang === "es" ? "Nuevo contacto desde eggeo.com.ar" : "New contact from eggeo.com.ar (EN)"} />
      <input type="hidden" name="idioma" value={lang} />
      <div className="hp" aria-hidden="true">
        <label>
          No completar
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-name">
            {F.name} <span className="req" aria-hidden="true">*</span>
          </label>
          <input id="f-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="f-email">
            {F.email} <span className="req" aria-hidden="true">*</span>
          </label>
          <input id="f-email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-company">{F.company}</label>
          <input id="f-company" name="empresa" type="text" autoComplete="organization" />
        </div>
        <div className="field">
          <label htmlFor="f-service">{F.service}</label>
          <select id="f-service" name="servicio" defaultValue={preset}>
            <option value="">{F.servicePlaceholder}</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.text.es.name}>
                {s.text[lang].name}
              </option>
            ))}
            <option value="Otro">{F.serviceOther}</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="f-msg">
          {F.message} <span className="req" aria-hidden="true">*</span>
        </label>
        <textarea id="f-msg" name="message" rows={6} required />
      </div>
      <p className="form-privacy">{F.privacy}</p>
      <div className="form-actions">
        <button className="btn primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? F.sending : F.submit} <Arrow />
        </button>
        <a className="btn wa" href={waLink(lang)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { place: "form" })}>
          <WhatsApp /> WhatsApp
          <span className="sr-only"> {UI[lang].newTab}</span>
        </a>
      </div>
      <p className={`form-status ${status}`} role="status" aria-live="polite">
        {status === "ok" ? F.success : status === "error" ? F.error : ""}
      </p>
    </form>
  );
}

export function Packs({ lang }) {
  const P = PACKS[lang];
  return (
    <section className="sec packs" aria-labelledby="packs-h">
      <div className="container">
        <h2 id="packs-h" className="sec-h">
          {P.title}
        </h2>
        <p className="sec-intro">{P.intro}</p>
        <ul className="pack-grid">
          {P.items.map((p) => (
            <li key={p.name} className={`pack reveal${p.best ? " best" : ""}`}>
              {p.best && <span className="pack-badge">{P.best}</span>}
              <h3>{p.name}</h3>
              <ul className="pack-list">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className="btn pack-btn" href={href("contact", lang)}>
                {P.cta}
                <span className="sr-only">: {p.name}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="addon reveal">
          <span className="addon-plus" aria-hidden="true">
            +
          </span>
          <div>
            <h3>{P.addon.name}</h3>
            <p>{P.addon.text}</p>
          </div>
          <a className="btn outline" href={href("service:ads", lang)}>
            {SERVICES.find((s) => s.id === "ads").text[lang].name} <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items, lang }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q} className="faq-item">
          <summary>
            <h3>{f.q}</h3>
            <span className="faq-icon" aria-hidden="true" />
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}
