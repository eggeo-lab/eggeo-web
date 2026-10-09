// Punto único para eventos de conversión. No carga ningún tracker: si en el futuro se
// aprueba GA4 / Tag Manager, los eventos ya quedan en window.dataLayer.
export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...params });
}

export function fmt(n, lang, compact = false) {
  const locale = lang === "es" ? "es-AR" : "en-US";
  if (!compact) return new Intl.NumberFormat(locale).format(n);
  // Miles con un decimal, como los reporta Meta: «230,3 mil» / «230.3K».
  const k = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n / 1000);
  return lang === "es" ? `${k} mil` : `${k}K`;
}
