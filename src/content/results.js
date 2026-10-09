// Resultados publicables aportados por EGGEO en los carruseles
// «EGGEO-STATS» (5 virales en Córdoba) y «GATA vs GATA» (CLIENTES/NUEVO).
// Copiar las cifras tal cual figuran en esas piezas; no estimar ni redondear de más.

export const VIRALS = [
  {
    id: "monaguillos",
    client: "Monaguillos",
    logo: "clients/mng",
    value: 9100000,
    metric: "plays",
    platform: "Instagram",
    chips: [
      { value: 796000, compact: true, key: "likes" },
      { value: 20700, compact: true, key: "shares" },
    ],
    sector: { es: "Parrilla · Barrio Güemes", en: "Grill · Barrio Güemes" },
  },
  {
    id: "risata",
    client: "Risata",
    logo: "clients/rst",
    caseId: "risata",
    value: 4254140,
    metric: "plays",
    platform: "Instagram",
    chips: [{ value: 72772, key: "organicShares" }],
    sector: { es: "Pizzería", en: "Pizzeria" },
  },
  {
    id: "bocatana",
    client: "Bocatana",
    logo: "clients/bta",
    value: 2600000,
    metric: "plays",
    period: "60d",
    platform: "TikTok",
    chips: [{ key: "organic" }],
    sector: { es: "Pizzería · TikTok", en: "Pizzeria · TikTok" },
  },
  {
    id: "corralon-san-carlos",
    client: "Corralón San Carlos",
    logo: null,
    value: 2178169,
    metric: "plays",
    platform: "Instagram",
    chips: [{ key: "humor" }, { key: "organic" }],
    sector: { es: "Retail de construcción", en: "Construction retail" },
  },
  {
    id: "distrito-rondeau",
    client: "Distrito Rondeau",
    logo: "clients/dr",
    value: 9549,
    metric: "sharesOneReel",
    platform: "Instagram",
    chips: [{ key: "followers182" }],
    sector: { es: "Bar · Nightlife", en: "Bar · Nightlife" },
  },
];

// Serie «Gata vs Gata» para Gata Maula. Fuente: Meta Analytics. El carrusel publica los capítulos 01, 02 y 04.
export const SERIES = [
  { ep: "01", views: 15955, reactions: 511, shares: 100 },
  { ep: "02", views: 18839, reactions: 603, shares: 105 },
  { ep: "04", views: 33010, reactions: 1075, shares: 422 },
];

export const RESULTS_TEXT = {
  es: {
    metaTitle: "Resultados: 5 virales en Córdoba en menos de un año | EGGEO",
    metaDescription:
      "Casos reales de contenido viral en Córdoba: 9,1 millones de reproducciones para Monaguillos, 4,2 millones para Risata y más. Sin influencers.",
    h1: "Hicimos 5 virales en Córdoba en menos de un año",
    h1Parts: ["Hicimos", "5 virales", "en Córdoba en menos de un año"],
    intro: "Sin comprar seguidores. Sin influencers. Con estrategia, ideas y producción propia.",
    totalLabel: "reproducciones en cuatro de estos casos",
    scaleTitle: "Las reproducciones, a escala",
    scaleNote: "El área de cada círculo es proporcional a las reproducciones.",
    labels: {
      plays: "reproducciones",
      sharesOneReel: "compartidos en un solo reel",
      likes: "likes",
      shares: "compartidos",
      organicShares: "compartidos orgánicos",
      organic: "100% orgánico",
      humor: "Contenido de humor",
      followers182: "+182% seguidores en un mes",
      in60d: "en 60 días",
    },
    sourceNote: "Datos de Instagram y TikTok de las cuentas de cada cliente, informados por EGGEO.",
    commonTitle: ["Ninguno pagó", "un influencer."],
    commonText: "Todos tenían estrategia.",
    seriesKicker: "Caso Gata Maula · La serie «Gata vs Gata»",
    seriesTitle: "De 16 mil a 33 mil views, capítulo a capítulo",
    seriesText:
      "Publicamos el contenido como una serie y el engagement creció en cada entrega. El contenido en serie construye audiencia; el contenido suelto acumula vistas.",
    seriesNote: "Fuente: Meta Analytics · serie «Gata vs Gata». El carrusel publicado muestra los capítulos 01, 02 y 04.",
    chapter: "Capítulo",
    views: "views",
    reactions: "reacciones",
    sharesShort: "compartidos",
    cta: "¿Querés resultados así?",
    homeKicker: "Resultados reales",
    homeTitle: "5 virales en menos de un año",
    homeLink: "Ver todos los resultados",
  },
  en: {
    metaTitle: "Results: 5 viral hits in Córdoba in under a year | EGGEO",
    metaDescription:
      "Real viral content case studies for brands in Córdoba, Argentina: 9.1 million plays for Monaguillos, 4.2 million for Risata and more. No bought followers, no influencers.",
    h1: "We made 5 viral hits in Córdoba in under a year",
    h1Parts: ["We made", "5 viral hits", "in Córdoba in under a year"],
    intro: "No bought followers. No influencers. Just strategy, ideas and in-house production.",
    totalLabel: "plays across four of these cases",
    scaleTitle: "The plays, to scale",
    scaleNote: "Each circle's area is proportional to its plays.",
    labels: {
      plays: "plays",
      sharesOneReel: "shares on a single reel",
      likes: "likes",
      shares: "shares",
      organicShares: "organic shares",
      organic: "100% organic",
      humor: "Humor content",
      followers182: "+182% followers in a month",
      in60d: "in 60 days",
    },
    sourceNote: "Instagram and TikTok data from each client's account, reported by EGGEO.",
    commonTitle: ["None of them paid", "an influencer."],
    commonText: "All of them had a strategy.",
    seriesKicker: "Gata Maula case · The «Gata vs Gata» series",
    seriesTitle: "From 16K to 33K views, episode by episode",
    seriesText:
      "We released the content as a series and engagement grew with every episode. Serialized content builds an audience; one-off posts just pile up views.",
    seriesNote: "Source: Meta Analytics · «Gata vs Gata» series. The published carousel shows episodes 01, 02 and 04.",
    chapter: "Episode",
    views: "views",
    reactions: "reactions",
    sharesShort: "shares",
    cta: "Want results like these?",
    homeKicker: "Real results",
    homeTitle: "5 viral hits in under a year",
    homeLink: "See all results",
  },
};

/** Suma de reproducciones de los virales medidos en reproducciones. */
export const TOTAL_PLAYS = VIRALS.filter((v) => v.metric === "plays").reduce((a, v) => a + v.value, 0);
