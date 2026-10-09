// Servicios de EGGEO: una página por servicio y por idioma.
// Los entregables reflejan los packs y el trabajo real de la agencia; sin precios.

export const SERVICES = [
  {
    id: "content",
    slug: { es: "contenido-redes-sociales", en: "social-media-content" },
    cases: ["heybon", "egran", "risata"],
    thumb: "work/heybon/process-02",
    text: {
      es: {
        name: "Contenido y redes sociales",
        short: "Estrategia, reels, carruseles y community management.",
        metaTitle: "Agencia de contenido para redes sociales en Córdoba | EGGEO",
        metaDescription:
          "Estrategia, producción de reels y carruseles, y community management para marcas. EGGEO, agencia creativa de Córdoba, Argentina.",
        h1: "Contenido para redes que la gente quiere ver",
        intro: "Reels, carruseles, stories y comunidad. Una idea clara por pieza.",
        deliverables: [
          "Estrategia y calendario de contenidos",
          "Reels short-form (guion, rodaje y edición)",
          "Carruseles de diseño, de producto y educativos",
          "Stories semanales",
          "Community management de lunes a viernes",
          "Informes mensuales de métricas",
        ],
        faqs: [
          {
            q: "¿Producen el contenido o solo lo publican?",
            a: "Lo producimos: dirección creativa, jornadas de producción, edición y diseño. También lo programamos y gestionamos la comunidad.",
          },
          {
            q: "¿Cómo miden si funciona?",
            a: "Con informes mensuales de Instagram y Meta: visualizaciones, alcance, interacciones, visitas al perfil, clics y seguidores, con análisis de las piezas destacadas.",
          },
          {
            q: "¿Trabajan con marcas fuera de Córdoba?",
            a: "Sí. Trabajamos de forma remota y coordinamos las jornadas de producción según lo que necesite cada proyecto.",
          },
        ],
      },
      en: {
        name: "Social media content",
        short: "Strategy, reels, carousels and community management.",
        metaTitle: "Social media content agency in Argentina | EGGEO",
        metaDescription:
          "Strategy, reels, designed carousels and community management for brands. EGGEO, a creative agency from Córdoba, Argentina.",
        h1: "Social content people actually want to watch",
        intro: "Reels, carousels, stories and community. One clear idea per piece.",
        deliverables: [
          "Content strategy and calendar",
          "Short-form reels (script, shoot and edit)",
          "Designed, product and educational carousels",
          "Weekly stories",
          "Community management, Monday to Friday",
          "Monthly performance reports",
        ],
        faqs: [
          {
            q: "Do you produce the content or just post it?",
            a: "We produce it: creative direction, production days, editing and design. We also schedule it and manage the community.",
          },
          {
            q: "How do you measure whether it works?",
            a: "With monthly Instagram and Meta reports: views, reach, interactions, profile visits, clicks and followers, plus an analysis of the top pieces.",
          },
          {
            q: "Do you work with brands outside Argentina?",
            a: "Yes. We work remotely and coordinate production days wherever the project needs them.",
          },
        ],
      },
    },
  },
  {
    id: "ads",
    slug: { es: "publicidad-digital", en: "paid-social" },
    cases: ["gata-maula", "risata", "heybon"],
    thumb: "work/heybon/ad-community",
    text: {
      es: {
        name: "Publicidad digital",
        short: "Campañas en Meta y Google con creatividad y medición.",
        metaTitle: "Agencia de publicidad en Meta Ads e Instagram | EGGEO",
        metaDescription:
          "Campañas en Meta Ads y Google Ads: creatividad, segmentación, optimización y reportes claros. Mirá resultados reales de clientes de EGGEO.",
        h1: "Pauta con ideas, no solo con presupuesto",
        intro: "Campañas en Meta e Instagram donde la creatividad hace la mitad del trabajo. Con números claros.",
        deliverables: [
          "Estrategia y estructura de campañas",
          "Creatividades para feed, stories y reels",
          "Segmentación y set-up de píxel y eventos",
          "Optimización durante la campaña",
          "Reporte de resultados por campaña",
        ],
        faqs: [
          {
            q: "¿La pauta está incluida en los packs de contenido?",
            a: "No. Cada campaña en Meta se cotiza como un módulo aparte: creatividad, set-up, optimización y reporte. Así sabés exactamente qué pagás y qué rinde.",
          },
          {
            q: "¿El presupuesto de anuncios lo pagan ustedes?",
            a: "No. La inversión en anuncios se paga directamente a Meta o Google desde la cuenta de tu marca; nosotros gestionamos la campaña.",
          },
          {
            q: "¿Qué resultados puedo esperar?",
            a: "Depende del objetivo, el producto y la inversión. Definimos juntos métricas concretas (clics, mensajes, seguidores, ventas) y las reportamos sin maquillaje.",
          },
        ],
      },
      en: {
        name: "Paid social",
        short: "Meta and Google campaigns with creative and measurement.",
        metaTitle: "Meta Ads and Instagram advertising agency | EGGEO",
        metaDescription:
          "Meta Ads and Google Ads campaigns: creative, targeting, optimization and clear reporting. See real results from EGGEO clients.",
        h1: "Paid media driven by ideas, not just budget",
        intro: "Meta and Instagram campaigns where the creative does half the work. With clear numbers.",
        deliverables: [
          "Campaign strategy and structure",
          "Creatives for feed, stories and reels",
          "Targeting, pixel and event setup",
          "In-flight optimization",
          "Results report per campaign",
        ],
        faqs: [
          {
            q: "Is paid media included in the content packages?",
            a: "No. Each Meta campaign is quoted as a separate module: creative, setup, optimization and reporting. You know exactly what you pay for and what it delivers.",
          },
          {
            q: "Do you pay for the ad spend?",
            a: "No. Ad spend is paid directly to Meta or Google from your brand's account; we manage the campaign.",
          },
          {
            q: "What results can I expect?",
            a: "It depends on the goal, the product and the budget. We agree on concrete metrics (clicks, messages, followers, sales) and report them honestly.",
          },
        ],
      },
    },
  },
  {
    id: "branding",
    slug: { es: "branding", en: "branding" },
    cases: ["la-gorgona"],
    thumb: "work/slg/isotype",
    text: {
      es: {
        name: "Branding e identidad",
        short: "Nombre, logo, sistema visual y narrativa de marca.",
        metaTitle: "Branding e identidad visual para marcas | EGGEO Córdoba",
        metaDescription:
          "Diseño de identidad de marca: concepto, logotipo, isotipo, paleta, tipografía, texturas y guía de estilo. Conocé el caso La Gorgona.",
        h1: "Marcas con una idea que se recuerda",
        intro: "Identidades con una idea fuerte: concepto, logo, paleta, texturas y piezas.",
        deliverables: [
          "Concepto y narrativa de marca",
          "Logotipo, isotipo y monograma",
          "Paleta de color y tipografía",
          "Texturas, recursos gráficos y motion",
          "Guía de estilo",
          "Piezas de lanzamiento para redes",
        ],
        faqs: [
          {
            q: "¿Cuánto tarda un proyecto de branding?",
            a: "Depende del alcance. Definimos etapas y entregas al inicio para que sepas qué vas a recibir y cuándo.",
          },
          {
            q: "¿Entregan los archivos editables?",
            a: "Sí. Entregamos los archivos finales en los formatos que acordemos para web, redes e impresión.",
          },
        ],
      },
      en: {
        name: "Branding and identity",
        short: "Naming, logo, visual system and brand story.",
        metaTitle: "Branding and visual identity agency in Argentina | EGGEO",
        metaDescription:
          "Brand identity design: concept, logotype, symbol, palette, typography, textures and style guide. See the La Gorgona case study.",
        h1: "Brands built on an idea people remember",
        intro: "Identities built on one strong idea: concept, logo, palette, textures and pieces.",
        deliverables: [
          "Brand concept and story",
          "Logotype, symbol and monogram",
          "Color palette and typography",
          "Textures, graphic assets and motion",
          "Style guide",
          "Launch pieces for social media",
        ],
        faqs: [
          {
            q: "How long does a branding project take?",
            a: "It depends on the scope. We set stages and deliverables up front so you know what you will get and when.",
          },
          {
            q: "Do you deliver editable files?",
            a: "Yes. We deliver the final files in the formats we agree on for web, social and print.",
          },
        ],
      },
    },
  },
  {
    id: "video",
    slug: { es: "produccion-audiovisual-ia", en: "video-ai-production" },
    cases: ["agpnyc", "egran", "risata"],
    thumb: "work/agpnyc/film",
    text: {
      es: {
        name: "Producción audiovisual e IA",
        short: "Foto, video, reels y piezas generadas con IA.",
        metaTitle: "Producción de reels, video y contenido con IA | EGGEO",
        metaDescription:
          "Fotografía, video, reels y piezas audiovisuales generadas con inteligencia artificial para marcas. Mirá el video con IA de AGPNYC.",
        h1: "Producción audiovisual, con cámara o con IA",
        intro: "Foto, video, reels y piezas con IA. La herramienta la elige la idea.",
        deliverables: [
          "Jornadas de producción de foto y video",
          "Fotografía de producto",
          "Reels y piezas para pauta",
          "Videos y animaciones generados con IA",
          "Edición, color y motion graphics",
        ],
        faqs: [
          {
            q: "¿Qué se puede hacer con IA?",
            a: "Animar fotografías existentes, crear escenas imposibles de filmar o producir variantes para campañas. Siempre con dirección creativa y revisión humana.",
          },
          {
            q: "¿Necesito material propio para un video con IA?",
            a: "No siempre, pero suma. En el caso AGPNYC usamos diez años de sesiones fotográficas de la productora como punto de partida.",
          },
        ],
      },
      en: {
        name: "Video and AI production",
        short: "Photo, video, reels and AI-generated pieces.",
        metaTitle: "Reels, video and AI content production | EGGEO",
        metaDescription:
          "Photography, video, reels and AI-generated films for brands. Watch the AI video EGGEO created for AGPNYC.",
        h1: "Video production, on camera or with AI",
        intro: "Photo, video, reels and AI pieces. The idea picks the tool.",
        deliverables: [
          "Photo and video production days",
          "Product photography",
          "Reels and ad creatives",
          "AI-generated videos and animations",
          "Editing, color and motion graphics",
        ],
        faqs: [
          {
            q: "What can be done with AI?",
            a: "Animate existing photos, create scenes that would be impossible to shoot, or produce campaign variations. Always with creative direction and human review.",
          },
          {
            q: "Do I need my own footage for an AI video?",
            a: "Not always, but it helps. For AGPNYC we started from ten years of the company's photo sessions.",
          },
        ],
      },
    },
  },
  {
    id: "web",
    slug: { es: "desarrollo-web", en: "web-development" },
    cases: [],
    thumb: null,
    text: {
      es: {
        name: "Desarrollo web",
        short: "Sitios y landings rápidos, accesibles y medibles.",
        metaTitle: "Diseño y desarrollo web, landings y SEO técnico | EGGEO",
        metaDescription:
          "Sitios institucionales, landings de campaña y e-commerce básico, con SEO técnico, buen rendimiento y medición. EGGEO, Córdoba.",
        h1: "Webs que cargan rápido y venden mejor",
        intro: "Sitios y landings rápidos, accesibles y pensados para vender.",
        deliverables: [
          "Sitios institucionales y portfolios",
          "Landings de campaña",
          "E-commerce básico",
          "SEO técnico y rendimiento",
          "Integración de formularios y analítica",
        ],
        faqs: [
          {
            q: "¿Pueden conectar el sitio con WhatsApp, formularios y analítica?",
            a: "Sí. Integramos formularios, WhatsApp y la medición de conversiones que necesites, siempre con tu aprobación.",
          },
          {
            q: "¿Incluye posicionamiento en Google?",
            a: "Incluye SEO técnico: estructura, velocidad, metadatos y datos estructurados. El posicionamiento también depende del contenido y del tiempo, y no prometemos puestos.",
          },
        ],
      },
      en: {
        name: "Web development",
        short: "Fast, accessible and measurable websites and landing pages.",
        metaTitle: "Web design and development, landing pages and technical SEO | EGGEO",
        metaDescription:
          "Company websites, campaign landing pages and simple e-commerce, with technical SEO, strong performance and analytics. EGGEO, Argentina.",
        h1: "Websites that load fast and sell better",
        intro: "Fast, accessible websites and landing pages built to sell.",
        deliverables: [
          "Company websites and portfolios",
          "Campaign landing pages",
          "Simple e-commerce",
          "Technical SEO and performance",
          "Forms and analytics integration",
        ],
        faqs: [
          {
            q: "Can you connect the site to WhatsApp, forms and analytics?",
            a: "Yes. We integrate forms, WhatsApp and the conversion tracking you need, always with your approval.",
          },
          {
            q: "Does it include ranking on Google?",
            a: "It includes technical SEO: structure, speed, metadata and structured data. Rankings also depend on content and time, and we don't promise positions.",
          },
        ],
      },
    },
  },
];

// Formas de trabajar (sin precios). La pauta en Meta es siempre un módulo aparte.
export const PACKS = {
  es: {
    title: "Formas de trabajar con nosotros",
    intro: "Tres packs mensuales de contenido orgánico. La pauta en Meta se suma como módulo aparte, por campaña.",
    cta: "Consultar",
    best: "El más elegido",
    items: [
      {
        name: "Historia Esencial",
        features: ["Dirección creativa estratégica", "3 videos short-form (15–45 s)", "1 carrusel de valor", "3 stories semanales", "1 jornada de producción", "Community management lun–vie"],
      },
      {
        name: "Historia en Crecimiento",
        best: true,
        features: ["Dirección creativa + estrategia", "5 videos short-form", "1 carrusel estratégico", "4 stories semanales", "1 jornada de producción", "Community management lun–vie"],
      },
      {
        name: "Historia Insignia",
        features: ["Dirección creativa full", "7 videos high-end", "Sesión de fotografía de producto", "2 carruseles", "5 stories semanales", "2 jornadas de producción", "Community management lun–vie"],
      },
    ],
    addon: {
      name: "Módulo Campaña Meta",
      text: "Creatividad, set-up, optimización y reporte de cada campaña en Meta Ads. Se suma a cualquier pack o se contrata por separado.",
    },
  },
  en: {
    title: "Ways to work with us",
    intro: "Three monthly organic content packages. Meta campaigns are added as a separate module, per campaign.",
    cta: "Ask about it",
    best: "Most popular",
    items: [
      {
        name: "Essential Story",
        features: ["Strategic creative direction", "3 short-form videos (15–45 s)", "1 value carousel", "3 weekly stories", "1 production day", "Community management Mon–Fri"],
      },
      {
        name: "Growth Story",
        best: true,
        features: ["Creative direction + strategy", "5 short-form videos", "1 strategic carousel", "4 weekly stories", "1 production day", "Community management Mon–Fri"],
      },
      {
        name: "Flagship Story",
        features: ["Full creative direction", "7 high-end videos", "Product photo session", "2 carousels", "5 weekly stories", "2 production days", "Community management Mon–Fri"],
      },
    ],
    addon: {
      name: "Meta Campaign module",
      text: "Creative, setup, optimization and reporting for each Meta Ads campaign. Add it to any package or hire it on its own.",
    },
  },
};

export const serviceById = (id) => SERVICES.find((s) => s.id === id);
