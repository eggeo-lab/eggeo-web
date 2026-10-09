// Textos de páginas (ES / EN). Los títulos y descripciones son únicos por ruta.

export const CLIENTS = [
  { name: "Génova", logo: "clients/gnv", url: "https://www.instagram.com/genova_restobar/" },
  { name: "Bocatana", logo: "clients/bta", url: "https://www.instagram.com/pizzeriabocatana/" },
  { name: "JD Pizzas", logo: "clients/jd", url: "https://www.instagram.com/jdpizzasylomos/" },
  { name: "Monaguillos", logo: "clients/mng", url: "https://www.instagram.com/monaguillosdeguemes/" },
  { name: "Gata Maula", logo: "clients/gma", url: "https://www.instagram.com/gatamaula.ok/" },
  { name: "El Imperio", logo: "clients/imp", url: "https://www.instagram.com/imperiomayorista/" },
  { name: "La Gorgona", logo: "clients/slg", url: "https://www.instagram.com/studiolagorgona/" },
  { name: "Distrito Rondeau", logo: "clients/dr", url: "https://www.instagram.com/distritorondeau/" },
  { name: "Risata", logo: "clients/rst", url: "https://www.instagram.com/risatapizza/" },
  { name: "Óptica Mediterránea", logo: "clients/omd", url: "https://www.instagram.com/mediterraneaoptica/" },
  { name: "Nuda Studio", logo: "clients/nuda", url: "https://www.instagram.com/nuda_studiopdc/" },
  { name: "Cuoca", logo: "clients/cuoca", url: "https://www.instagram.com/cuoca.ricoychulo/" },
];

export const TEAM = [
  {
    name: "Manuel Pramparo",
    role: { es: "Cofundador · Dirección creativa y estrategia", en: "Co-founder · Creative direction and strategy" },
    bio: {
      es: "Storytelling, campañas disruptivas y comunidades digitales. El cerebro detrás de la narrativa.",
      en: "Storytelling, disruptive campaigns and digital communities. The mind behind the narrative.",
    },
  },
  {
    name: "Nicolás Capell",
    role: { es: "Cofundador · Dirección creativa, IA y fotografía", en: "Co-founder · Creative direction, AI and photography" },
    bio: {
      es: "IA aplicada al marketing y producción visual de alto nivel. Lidera la integración tecnológica.",
      en: "AI applied to marketing and high-end visual production. Leads technology integration.",
    },
  },
  {
    name: "Elías Rivarola",
    role: { es: "Cofundador · Paid media, performance y desarrollo web", en: "Co-founder · Paid media, performance and web development" },
    bio: {
      es: "Estrategia de pauta en Meta y código robusto. Convierte creatividad en resultados medibles.",
      en: "Meta ads strategy and solid code. Turns creativity into measurable results.",
    },
  },
];

export const PAGES = {
  es: {
    home: {
      metaTitle: "EGGEO | Agencia creativa en Córdoba. Ideas absurdas, resultados serios",
      metaDescription:
        "Agencia creativa de branding, contenido para redes, Meta Ads, producción audiovisual con IA y desarrollo web. Desde Córdoba, Argentina, para marcas de todo el mundo.",
      eyebrow: "EGGEO · Agencia creativa en Córdoba, Argentina",
      hero: ["IDEAS", "ABSURDAS", "RESULTADOS", "SERIOS"],
      heroLabel: "Ideas absurdas, resultados serios",
      sub: "Branding, contenido, pauta y web. Desde Córdoba para el mundo.",
      workTitle: "Proyectos seleccionados",
      workIntro: "De Córdoba a Nueva York.",
      manifesto: {
        absurdTitle: "Ideas absurdas",
        absurdText:
          "Huevos fritos en lugar de ojos. Una idea rara bien hecha se recuerda más que diez correctas.",
        seriousTitle: "Resultados serios",
        seriousText: "5 virales en menos de un año. Sin influencers.",
        stats: [
          { value: 9100000, label: "reproducciones para Monaguillos", note: "Instagram · parrilla de Barrio Güemes", href: "results" },
          { value: 4254140, label: "reproducciones en un solo reel para Risata", note: "Instagram, reel del 3/9/2024", href: "case:risata" },
          { value: 2600000, label: "reproducciones en 60 días para Bocatana", note: "TikTok · 100% orgánico", href: "results" },
        ],
        more: "Ver los 5 virales",
      },
      servicesTitle: "Qué hacemos",
      processTitle: "Cómo trabajamos",
      process: [
        { t: "Escuchar", d: "Tu marca, tu público, tu objetivo." },
        { t: "Idear", d: "La idea que nadie más te va a proponer." },
        { t: "Producir", d: "Rodaje, diseño, edición y control de calidad." },
        { t: "Medir", d: "Números claros para mejorar lo que sigue." },
      ],
      teamTitle: "Tres cofundadores, una idea fija",
      teamText: "Creatividad, IA y performance.",
      ctaTitle: ["¿Tenés una idea", "absurda?"],
      ctaText: "Contanos qué querés lograr. Te respondemos con una propuesta.",
    },
    services: {
      metaTitle: "Servicios: branding, contenido, pauta, video con IA y web | EGGEO",
      metaDescription:
        "Conocé los servicios de EGGEO: contenido y redes sociales, publicidad en Meta, branding, producción audiovisual con IA y desarrollo web.",
      h1: "Servicios",
      intro: "Cinco disciplinas, solas o combinadas.",
    },
    work: {
      metaTitle: "Proyectos y casos de estudio | EGGEO, agencia creativa",
      metaDescription:
        "Casos de branding, contenido, Meta Ads y video con IA de EGGEO: La Gorgona, Heybon, AGPNYC, Egran, Risata y Gata Maula.",
      h1: "Proyectos",
      intro: "La idea, lo que hicimos y lo que pasó.",
    },
    agency: {
      metaTitle: "La agencia: quiénes somos y cómo trabajamos | EGGEO",
      metaDescription:
        "EGGEO es una agencia creativa de Córdoba, Argentina, fundada por Manuel Pramparo, Nicolás Capell y Elías Rivarola. Branding, contenido, pauta, IA y web.",
      h1: "Somos EGGEO",
      lead: "Agencia creativa de Córdoba, Argentina. Branding, contenido, Meta Ads, video con IA y web.",
      body: [
        "Trabajamos en dos tiempos: primero, ideas que se animan a ser raras. Después, ejecución prolija y números que se pueden revisar.",
        "Trabajamos con marcas de gastronomía, moda, alimentos, retail y producción audiovisual, en Argentina y en el exterior.",
      ],
      factsTitle: "En pocas palabras",
      facts: [
        { k: "Base", v: "Córdoba, Argentina" },
        { k: "Idiomas", v: "Español e inglés" },
        { k: "Disciplinas", v: "Branding · Contenido · Meta Ads · Video e IA · Web" },
        { k: "Rubros", v: "Gastronomía, moda, alimentos, retail, productoras" },
      ],
      teamTitle: "El equipo",
      valuesTitle: "Lo que no negociamos",
      values: [
        { t: "Una idea por pieza", d: "Si no se puede explicar en una frase, todavía no está lista." },
        { t: "Números sin maquillaje", d: "Reportamos lo que pasó, también cuando no salió como esperábamos." },
        { t: "Calidad antes de publicar", d: "Cada entrega pasa por un control de calidad antes de salir." },
      ],
    },
    contact: {
      metaTitle: "Contacto: contanos tu proyecto | EGGEO",
      metaDescription:
        "Escribinos para un proyecto de branding, contenido, pauta en Meta, video con IA o web. Respondemos por formulario o WhatsApp.",
      h1: "Hablemos",
      intro: "Contanos qué querés lograr y te escribimos.",
      form: {
        name: "Nombre",
        email: "Email",
        company: "Marca o empresa (opcional)",
        service: "¿Qué necesitás?",
        servicePlaceholder: "Elegí una opción",
        serviceOther: "Otra cosa / no estoy seguro",
        message: "Contanos sobre el proyecto",
        privacy: "Usamos estos datos solo para responderte. El formulario se envía a través de Formspree.",
        submit: "Enviar mensaje",
        sending: "Enviando…",
        success: "¡Gracias! Recibimos tu mensaje y te respondemos a la brevedad.",
        error: "No pudimos enviar el mensaje. Probá de nuevo o escribinos por WhatsApp.",
        required: "Obligatorio",
      },
      altTitle: "¿Preferís algo más directo?",
    },
    notFound: {
      metaTitle: "Página no encontrada | EGGEO",
      metaDescription: "La página que buscás no existe o cambió de dirección.",
      h1: "Este huevo no existe",
      text: "La página que buscás no está o cambió de lugar. Volvé al inicio o mirá nuestros proyectos.",
    },
  },
  en: {
    home: {
      metaTitle: "EGGEO | Creative agency from Argentina — Absurd ideas, serious results",
      metaDescription:
        "Creative agency for branding, social media content, Meta Ads, AI video production and web development. Based in Córdoba, Argentina, working with brands worldwide.",
      eyebrow: "EGGEO · Creative agency from Córdoba, Argentina",
      hero: ["ABSURD", "IDEAS", "SERIOUS", "RESULTS"],
      heroLabel: "Absurd ideas, serious results",
      sub: "Branding, content, paid social and web. From Córdoba to the world.",
      workTitle: "Selected work",
      workIntro: "From Córdoba to New York.",
      manifesto: {
        absurdTitle: "Absurd ideas",
        absurdText:
          "Fried eggs instead of eyes. One strange idea done well beats ten correct ones.",
        seriousTitle: "Serious results",
        seriousText: "5 viral hits in under a year. No influencers.",
        stats: [
          { value: 9100000, label: "plays for Monaguillos", note: "Instagram · grill in Barrio Güemes", href: "results" },
          { value: 4254140, label: "plays on a single reel for Risata", note: "Instagram, reel from 9/3/2024", href: "case:risata" },
          { value: 2600000, label: "plays in 60 days for Bocatana", note: "TikTok · 100% organic", href: "results" },
        ],
        more: "See all 5 viral hits",
      },
      servicesTitle: "What we do",
      processTitle: "How we work",
      process: [
        { t: "Listen", d: "Your brand, your audience, your goal." },
        { t: "Ideate", d: "The idea nobody else will pitch you." },
        { t: "Produce", d: "Shooting, design, editing and quality checks." },
        { t: "Measure", d: "Clear numbers to improve what comes next." },
      ],
      teamTitle: "Three co-founders, one fixed idea",
      teamText: "Creativity, AI and performance.",
      ctaTitle: ["Got an absurd", "idea?"],
      ctaText: "Tell us what you want to achieve and we'll put together a tailored proposal.",
    },
    services: {
      metaTitle: "Services: branding, content, paid social, AI video and web | EGGEO",
      metaDescription:
        "Explore EGGEO's services: social media content, Meta advertising, branding, AI video production and web development.",
      h1: "Services",
      intro: "Five disciplines, alone or combined.",
    },
    work: {
      metaTitle: "Work and case studies | EGGEO, creative agency",
      metaDescription:
        "Branding, content, Meta Ads and AI video case studies by EGGEO: La Gorgona, Heybon, AGPNYC, Egran, Risata and Gata Maula.",
      h1: "Work",
      intro: "The idea, what we did and what happened.",
    },
    agency: {
      metaTitle: "The agency: who we are and how we work | EGGEO",
      metaDescription:
        "EGGEO is a creative agency from Córdoba, Argentina, founded by Manuel Pramparo, Nicolás Capell and Elías Rivarola. Branding, content, paid social, AI and web.",
      h1: "We are EGGEO",
      lead: "Creative agency from Córdoba, Argentina. Branding, content, Meta Ads, AI video and web.",
      body: [
        "We work in two beats: first, ideas brave enough to be strange. Then, careful execution and numbers you can check.",
        "We work with food, fashion, retail and production brands, in Argentina and abroad.",
      ],
      factsTitle: "In short",
      facts: [
        { k: "Based in", v: "Córdoba, Argentina" },
        { k: "Languages", v: "Spanish and English" },
        { k: "Disciplines", v: "Branding · Content · Meta Ads · Video & AI · Web" },
        { k: "Industries", v: "Food, fashion, retail, production companies" },
      ],
      teamTitle: "The team",
      valuesTitle: "Non-negotiables",
      values: [
        { t: "One idea per piece", d: "If it can't be explained in one sentence, it isn't ready yet." },
        { t: "Honest numbers", d: "We report what happened, including when it didn't go as planned." },
        { t: "Quality before publishing", d: "Every delivery goes through a quality check before it goes out." },
      ],
    },
    contact: {
      metaTitle: "Contact: tell us about your project | EGGEO",
      metaDescription:
        "Get in touch about a branding, content, Meta ads, AI video or web project. Reach us through the form or WhatsApp.",
      h1: "Let's talk",
      intro: "Tell us what you want to achieve and we'll get back to you.",
      form: {
        name: "Name",
        email: "Email",
        company: "Brand or company (optional)",
        service: "What do you need?",
        servicePlaceholder: "Choose an option",
        serviceOther: "Something else / not sure",
        message: "Tell us about the project",
        privacy: "We only use this information to reply to you. The form is sent through Formspree.",
        submit: "Send message",
        sending: "Sending…",
        success: "Thank you! We got your message and will get back to you soon.",
        error: "We couldn't send your message. Please try again or message us on WhatsApp.",
        required: "Required",
      },
      altTitle: "Prefer something more direct?",
    },
    notFound: {
      metaTitle: "Page not found | EGGEO",
      metaDescription: "The page you are looking for doesn't exist or has moved.",
      h1: "This egg doesn't exist",
      text: "The page you're looking for isn't here or has moved. Head back home or check out our work.",
    },
  },
};
