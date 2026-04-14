import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

// ==========================================
// MOBILE CAROUSEL COMPONENT
// ==========================================
function MobileCarousel({ children, className = "" }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  const startXRef = useRef(null);
  const count = React.Children.count(children);

  const goTo = useCallback(
    (idx) => {
      const clamped = Math.max(0, Math.min(idx, count - 1));
      setCurrent(clamped);
      if (trackRef.current) {
        trackRef.current.scrollTo({
          left: trackRef.current.offsetWidth * clamped,
          behavior: "smooth",
        });
      }
    },
    [count],
  );

  // Sync dots when user scrolls manually
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => {
      const idx = Math.round(track.scrollLeft / track.offsetWidth);
      setCurrent(idx);
    };
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`mob-carousel ${className}`}>
      <div className="mob-carousel-track" ref={trackRef}>
        {React.Children.map(children, (child, i) => (
          <div className="mob-carousel-slide" key={i}>
            {child}
          </div>
        ))}
      </div>
      <div className="mob-carousel-dots">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Ir a ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 1. DATA & CONTENT (FULL)
// ==========================================
const DATA = {
  es: {
    nav: {
      work: "Proyectos",
      services: "Servicios",
      team: "Equipo",
      pricing: "Planes",
      contact: "Contacto",
    },
    hero: ["IDEAS", "ABSURDAS", "RESULTADOS", "SERIOS"],
    sub: "Agencia estratégica de contenido, ads y desarrollo web. Convirtiendo ruido en señal desde Córdoba para el mundo.",
    cta: { see: "Ver Portfolio", talk: "Agendar Llamada", wa: "WhatsApp" },
    titles: {
      work: "Proyectos Seleccionados",
      services: "Nuestros Servicios",
      team: "El Equipo",
      pricing: "Propuestas de Valor",
      contact: "Hablemos",
      clients: "Confían en nosotros",
    },

    team: [
      {
        name: "Manuel Pramparo",
        role: "Cofundador - Dirección Creativa & Estrategia",
        desc: "Storytelling, campañas disruptivas y comunidades digitales. El cerebro detrás de la narrativa.",
      },
      {
        name: "Nicolás Capell",
        role: "Cofundador - Dirección Creativa, IA & Fotografía",
        desc: "IA aplicada al marketing y producción visual de alto nivel. Lidera la integración tecnológica.",
      },
      {
        name: "Elías Rivarola",
        role: "Cofundador - Paid Media, Performance & Desarrollo Web",
        desc: "Estrategia de pauta en Meta y código robusto. Convierte creatividad en resultados medibles.",
      },
    ],

    // PACKS (SIN PRECIOS)
    pricing: [
      {
        name: "Historia Esencial",
        features: [
          "Dirección creativa estratégica",
          "3 videos short-form (15-45s)",
          "1 carrusel de valor",
          "3 stories semanales",
          "1 jornada de producción",
          "Community Management lun-vie",
        ],
      },
      {
        name: "Historia en Crecimiento",
        features: [
          "Dirección creativa + Estrategia",
          "5 videos short-form",
          "1 carrusel estratégico",
          "4 stories semanales",
          "1 jornada de producción",
          "CM + Gestión Pauta Meta",
        ],
        best: true,
      },
      {
        name: "Historia Insignia",
        features: [
          "Dirección creativa full",
          "7 videos high-end",
          "Sesión de fotografía de producto",
          "2 carruseles",
          "5 stories semanales",
          "2 jornadas producción",
          "CM + Gestión Pauta Full",
        ],
      },
    ],

    servicesList: [
      {
        title: "Estrategia & Gestión de Redes",
        items: [
          "Planificación integral",
          "Community Management",
          "Calendarios & reporting",
        ],
      },
      {
        title: "Producción Audiovisual",
        items: [
          "Foto & video",
          "Reels & carrousels",
          "Coberturas y piezas de pauta",
        ],
      },
      {
        title: "Campañas Creativas & Eventos",
        items: [
          "Lanzamientos",
          "Activaciones en calle",
          "Experiencias con conversación",
        ],
      },
      {
        title: "Branding & Comunicación",
        items: ["Identidad & narrativa", "Posicionamiento", "Guías de estilo"],
      },
      {
        title: "Desarrollo Web & Landings",
        items: [
          "Landing de campaña",
          "E-commerce básico",
          "SEO técnico & performance",
        ],
      },
      {
        title: "Meta/Google Ads",
        items: [
          "Estrategia & set-up",
          "Segmentación & optimización",
          "Medición (GA4/Pixels)",
        ],
      },
    ],

    work: [
      {
        title: "Gata Maula",
        cat: "Ads & Content",
        res: "Crecimiento continuo",
        img: "gata-maula.jpeg",
        caseStudy:
          "Desarrollamos una estrategia de contenido y pauta en Meta que llevó a Gata Maula a más de 230 mil visualizaciones, 6.692 clics en enlace y 2.748 nuevos seguidores. La combinación de contenido auténtico con segmentación precisa disparó el engagement.",
      },
      {
        title: "Uila Café",
        cat: "Branding & Content",
        res: "Brand Awareness",
        img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800",
        caseStudy:
          "Creamos una identidad visual que respira el aroma del café de especialidad. Desde el menú hasta el feed de Instagram, todo comunica calidez y calidad, atrayendo a un público más exigente.",
      },
      {
        title: "Risata",
        cat: "Ads & Strategy",
        res: "981k Visualizaciones",
        img: "risata.jpeg",
        caseStudy:
          "Gestionamos la cuenta de Risata logrando 981 mil visualizaciones, 324 mil de alcance, 12.3 mil interacciones y 9.5 mil clics en enlace durante 2025. Una estrategia de contenido y pauta que convirtió su perfil en un canal de adquisición constante.",
      },
      {
        title: "Nutrix",
        cat: "Web & SEO",
        res: "+45% Leads",
        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800",
        caseStudy:
          "Optimizamos la landing page de ventas reduciendo la fricción en el checkout y mejorando la velocidad de carga en un 40%. Las conversiones se dispararon en el primer mes de implementación.",
      },
    ],
    form: {
      name: "Tu nombre",
      email: "Tu email",
      msg: "Cuéntanos sobre tu proyecto...",
      btn: "Enviar Mensaje",
      or: "o háblanos por",
    },
  },

  en: {
    nav: {
      work: "Work",
      services: "Services",
      team: "Team",
      pricing: "Pricing",
      contact: "Contact",
    },
    hero: ["ABSURD", "IDEAS", "SERIOUS", "RESULTS"],
    sub: "Strategic content, ads, and web development agency. Turning noise into signal from Córdoba to the world.",
    cta: { see: "View Work", talk: "Let's Talk" },
    titles: {
      work: "Selected Work",
      services: "Services",
      team: "The Team",
      pricing: "Value Propositions",
      contact: "Contact Us",
      clients: "Clients",
    },
    team: [
      {
        name: "Manuel Pramparo",
        role: "Co-founder - Creative Direction & Strategy",
        desc: "Storytelling, disruptive campaigns and digital communities.",
      },
      {
        name: "Nicolás Capell",
        role: "Co-founder - Creative Direction, AI & Photography",
        desc: "AI applied to marketing and visual production. Leads tech integration.",
      },
      {
        name: "Elías Rivarola",
        role: "Co-founder - Paid Media, Performance & Web Dev",
        desc: "Meta ads strategy and robust code. Converts creativity into results.",
      },
    ],
    pricing: [
      {
        name: "Essential Story",
        features: [
          "Creative direction",
          "3 short videos",
          "1 carousel",
          "3 weekly stories",
          "1 production day",
          "Community Management",
        ],
      },
      {
        name: "Growth Story",
        features: [
          "Creative Strategy",
          "5 short videos",
          "1 strategic carousel",
          "4 weekly stories",
          "1 production day",
          "CM + Meta Ads",
        ],
        best: true,
      },
      {
        name: "Flagship Story",
        features: [
          "Full Creative Direction",
          "7 high-end videos",
          "Product Photography",
          "2 carousels",
          "5 weekly stories",
          "2 production days",
          "CM + Full Ads",
        ],
      },
    ],
    servicesList: [
      {
        title: "Social Media Strategy",
        items: ["Full planning", "Community Management", "Reporting"],
      },
      {
        title: "Audiovisual Production",
        items: ["Photo & video", "Reels & carousels", "Ad creatives"],
      },
      {
        title: "Creative Campaigns",
        items: ["Launches", "Street activations", "Brand experiences"],
      },
      {
        title: "Branding",
        items: ["Identity & narrative", "Positioning", "Style guides"],
      },
      {
        title: "Web Development",
        items: ["Campaign landings", "E-commerce", "Technical SEO"],
      },
      {
        title: "Performance Ads",
        items: ["Strategy & set-up", "Optimization", "Measurement (GA4)"],
      },
    ],
    work: [
      {
        title: "Gata Maula",
        cat: "Ads & Content",
        res: "Ongoing growth",
        img: "gata-maula.jpg",
        caseStudy:
          "We developed a content and Meta ads strategy that drove over 230k views, 6,692 link clicks and 2,748 new followers. Authentic content combined with precise targeting skyrocketed engagement.",
      },
      {
        title: "Uila Café",
        cat: "Branding & Content",
        res: "Brand Awareness",
        img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800",
        caseStudy: "Detailed case study description here.",
      },
      {
        title: "Risata",
        cat: "Ads & Strategy",
        res: "981k Views",
        img: "risata.jpg",
        caseStudy:
          "We managed Risata's account achieving 981k views, 324k reach, 12.3k interactions and 9.5k link clicks in 2025. A content and ads strategy that turned their profile into a constant acquisition channel.",
      },
      {
        title: "Nutrix",
        cat: "Web & SEO",
        res: "+45% Leads",
        img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800",
        caseStudy: "Detailed case study description here.",
      },
    ],
    form: {
      name: "Your Name",
      email: "Your Email",
      msg: "Tell us about your project...",
      btn: "Send Message",
      or: "or chat on",
    },
  },
};

const CLIENTS = [
  {
    name: "GENOVA",
    logo: "logos/black_GNV-logo.png",
    url: "https://instagram.com/genova_restobar",
    cls: "",
  },
  {
    name: "BOCATANA",
    logo: "logos/black_BTA-logo.png",
    url: "https://instagram.com/pizzeriabocatana",
    cls: "logo-bocatana",
  },
  {
    name: "JD PIZZAS",
    logo: "logos/black_JD-logo.png",
    url: "https://instagram.com/jdpizzasylomos",
    cls: "",
  },
  {
    name: "MONAGUILLOS",
    logo: "logos/black_MNG-logo.png",
    url: "https://instagram.com/monaguillosdeguemes",
    cls: "",
  },
  {
    name: "GATA MAULA",
    logo: "logos/black_GMA-logo.png",
    url: "https://instagram.com/gatamaula.ok",
    cls: "",
  },
  {
    name: "EL IMPERIO",
    logo: "logos/black_IMP-logo.png",
    url: "https://instagram.com/imperiomayorista",
    cls: "",
  },
  {
    name: "LA GORGONA",
    logo: "logos/black_SLG-logo.png",
    url: "https://instagram.com/studiolagorgona",
    cls: "logo-gorgona",
  },
  {
    name: "DISTRITO",
    logo: "logos/black_DR-logo.png",
    url: "https://instagram.com/distritorondeau",
    cls: "",
  },
  {
    name: "RISATA",
    logo: "logos/black_RST-logo.png",
    url: "https://instagram.com/risatapizza",
    cls: "",
  },
  {
    name: "ÓTICA MEDITERRANEA",
    logo: "logos/black_OMD-logo.png",
    url: "https://instagram.com/mediterraneaoptica",
    cls: "",
  },
];

// ICONOS SVG
const Icons = {
  Sun: () => (
    <svg viewBox="0 0 24 24" className="icon-svg">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" className="icon-svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Burger: () => (
    <svg viewBox="0 0 24 24" className="icon-svg">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  WA: () => (
    <svg
      viewBox="0 0 24 24"
      style={{ width: 24, height: 24, fill: "currentColor" }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  ),
};

export default function App() {
  const [lang, setLang] = useState("es");
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const [wipe, setWipe] = useState({ open: false, x: 0, y: 0, item: null });

  const T = useMemo(() => DATA[lang], [lang]);

  useEffect(() => {
    const handleScroll = () => setShrunk(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    // Scroll Reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lang]);

  // Kinetic Mouse Effect
  useEffect(() => {
    const hero = document.getElementById("hero-section");
    if (!hero) return;
    const handleMove = (e) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      const container = hero.querySelector(".kt-container");
      if (container) {
        container.style.setProperty("--mx", x);
        container.style.setProperty("--my", y);
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const triggerWipe = (e, item) => {
    const x = e.clientX;
    const y = e.clientY;
    setWipe({ open: true, x, y, item });
  };
  const closeWipe = () => setWipe((prev) => ({ ...prev, open: false }));

  const scrollToContact = () => {
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-root">
      {/* HEADER AMARILLO */}
      <header
        className={`hd ${shrunk ? "shrunk" : ""} ${theme === "light" ? "y" : ""}`}
      >
        <div className="container bar">
          <a
            href="#home"
            onClick={scrollToTop}
            className="logo-link"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div className="gg">GG</div>
            <span style={{ fontWeight: 900, fontSize: 22 }}>EGGEO.</span>
          </a>

          <nav className="nav-desk">
            {Object.entries(T.nav).map(([key, label]) => (
              <a key={key} href={`#${key}`} className="nav-link">
                {label}
              </a>
            ))}
          </nav>

          <div className="actions">
            <button
              onClick={() => setLang((l) => (l === "es" ? "en" : "es"))}
              className="btn-icon"
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() =>
                setTheme((t) => (t === "light" ? "dark" : "light"))
              }
              className="btn-icon"
            >
              {theme === "light" ? <Icons.Moon /> : <Icons.Sun />}
            </button>
            <button onClick={() => setMobileOpen(true)} className="burger">
              <Icons.Burger />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mnav ${mobileOpen ? "open" : ""}`}>
        <button className="mnav-close" onClick={() => setMobileOpen(false)}>
          ✕
        </button>
        <div className="mobile-links">
          {Object.entries(T.nav).map(([key, label]) => (
            <a
              key={key}
              href={`#${key}`}
              className="m-link"
              onClick={() => setMobileOpen(false)}
            >
              {label} <span>0{Object.keys(T.nav).indexOf(key) + 1}</span>
            </a>
          ))}
        </div>
      </div>

      <main>
        {/* HERO */}
        <section id="hero-section" className="hero container">
          <div className="kt-container">
            <div className="kt">
              {T.hero.map((word, i) => (
                <div key={i} className="rowK">
                  {word.split("").map((char, j) => (
                    <span
                      className="ch"
                      key={j}
                      style={{ animationDelay: `${i * 0.1 + j * 0.05}s` }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="sub-hero">{T.sub}</p>
          <div className="reveal hero-ctas">
            <a href="#work" className="btn primary">
              {T.cta.see}
            </a>
            <a href="#contact" className="btn outline">
              {T.cta.talk}
            </a>
          </div>
        </section>

        {/* CLIENTS (Marquee) */}
        <section
          id="clients"
          className="sec white"
          style={{ padding: "60px 0" }}
        >
          <div className="container">
            <h2
              className="sec-h"
              style={{
                textAlign: "center",
                fontSize: 20,
                marginBottom: 40,
                opacity: 0.5,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {T.titles.clients}
            </h2>
          </div>
          <div className="marquee-wrapper">
            <div className="marquee-track">
              {[...CLIENTS, ...CLIENTS].map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="client-item"
                  aria-label={c.name}
                >
                  <img
                    src={c.logo}
                    alt={c.name}
                    className={`client-logo-img ${c.cls}`}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="sec white">
          <div className="container">
            <h2 className="sec-h">{T.titles.work}</h2>
            <div className="grid grid-2">
              {T.work.map((w, i) => (
                <div
                  key={i}
                  className="card reveal"
                  onClick={(e) => triggerWipe(e, w)}
                >
                  <div
                    className="work-img"
                    style={{ backgroundImage: `url(${w.img})` }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ fontSize: 24, fontWeight: 800 }}>{w.title}</h3>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        background: "rgba(0,0,0,0.05)",
                        padding: "6px 12px",
                        borderRadius: 8,
                      }}
                    >
                      {w.cat}
                    </span>
                  </div>
                  <p
                    style={{
                      marginTop: 12,
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {w.res}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="sec">
          <div className="container">
            <h2 className="sec-h">{T.titles.services}</h2>
            {/* Desktop grid */}
            <div className="grid grid-3 hide-mobile">
              {T.servicesList.map((s, i) => (
                <div key={i} className="svc-card reveal">
                  <h3>{s.title}</h3>
                  <ul>
                    {s.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {/* Mobile carousel */}
            <div className="show-mobile">
              <MobileCarousel>
                {T.servicesList.map((s, i) => (
                  <div key={i} className="svc-card">
                    <h3>{s.title}</h3>
                    <ul>
                      {s.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </MobileCarousel>
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" className="sec dark">
          <div className="container">
            <h2 className="sec-h inv">{T.titles.team}</h2>
            <div className="grid grid-3">
              {T.team.map((member, i) => (
                <div key={i} className="team-card reveal">
                  <h3>{member.name}</h3>
                  <span className="role">{member.role}</span>
                  <p>{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING (No Prices) */}
        <section id="pricing" className="sec">
          <div className="container">
            <h2 className="sec-h">{T.titles.pricing}</h2>
            {/* Desktop grid */}
            <div className="grid grid-3 hide-mobile">
              {T.pricing.map((p, i) => (
                <div
                  key={i}
                  className={`price-card reveal ${p.best ? "best" : ""}`}
                >
                  <h3>{p.name}</h3>
                  <ul className="price-list">
                    {p.features.map((f, index) => (
                      <li key={index}>
                        <span
                          style={{
                            color: "var(--egg-yellow)",
                            fontWeight: 900,
                            minWidth: 20,
                          }}
                        >
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className="btn price-btn" onClick={scrollToContact}>
                    Consultar
                  </button>
                </div>
              ))}
            </div>
            {/* Mobile carousel */}
            <div className="show-mobile">
              <MobileCarousel>
                {T.pricing.map((p, i) => (
                  <div key={i} className={`price-card ${p.best ? "best" : ""}`}>
                    <h3>{p.name}</h3>
                    <ul className="price-list">
                      {p.features.map((f, index) => (
                        <li key={index}>
                          <span
                            style={{
                              color: "var(--egg-yellow)",
                              fontWeight: 900,
                              minWidth: 20,
                            }}
                          >
                            ✓
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button className="btn price-btn" onClick={scrollToContact}>
                      Consultar
                    </button>
                  </div>
                ))}
              </MobileCarousel>
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section id="contact" className="sec">
          <div className="container">
            <h2 className="sec-h">{T.titles.contact}</h2>
            <div className="form-wrap reveal">
              {/* Formspree Ready */}
              <form
                className="form-grid"
                action="https://formspree.io/f/maqovqdj"
                method="POST"
              >
                <input
                  type="text"
                  name="name"
                  placeholder={T.form.name}
                  className="inp"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder={T.form.email}
                  className="inp"
                  required
                />
                <textarea
                  name="message"
                  placeholder={T.form.msg}
                  className="inp"
                  required
                ></textarea>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <button
                    className="btn primary"
                    style={{ flex: 1 }}
                    type="submit"
                  >
                    {T.form.btn}
                  </button>
                  <span style={{ opacity: 0.5, fontSize: 14 }}>
                    {T.form.or}
                  </span>
                  <a
                    href="https://wa.me/543571619535"
                    target="_blank"
                    className="btn wa"
                    style={{ flex: 1 }}
                  >
                    <Icons.WA /> WhatsApp
                  </a>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="foot-grid">
            <div className="foot-col">
              <h4 style={{ fontSize: 28 }}>EGGEO.</h4>
              <p style={{ opacity: 0.6, maxWidth: 300 }}>
                Ideas absurdas, resultados serios.
              </p>
            </div>
            <div className="foot-cols-bottom">
              <div className="foot-col">
                <h4>Menú</h4>
                <a href="#work">Proyectos</a>
                <a href="#team">Equipo</a>
                <a href="#pricing">Packs</a>
              </div>
              <div className="foot-col">
                <h4>Social</h4>
                <a
                  href="https://instagram.com/eggeo.lab"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a href="https://www.linkedin.com/company/eggeo/">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} EGGEO Agency. Córdoba, Argentina.
          </div>
        </div>
      </footer>

      {/* WIPE OVERLAY (Project Details) */}
      <div className={`wipe ${wipe.open ? "open" : ""}`} onClick={closeWipe}>
        <div
          className="mask"
          style={{ "--x": `${wipe.x}px`, "--y": `${wipe.y}px` }}
        />
        {wipe.open && wipe.item && (
          <div className="detail-content">
            <div className="detail-box">
              <h2
                style={{
                  color: "#fff",
                  fontSize: "clamp(40px, 8vw, 80px)",
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                {wipe.item.title}
              </h2>
              <div
                className="detail-img"
                style={{ backgroundImage: `url(${wipe.item.img})` }}
              />

              <p
                style={{
                  color: "var(--egg-yellow)",
                  fontSize: 24,
                  marginTop: 20,
                  fontWeight: 700,
                }}
              >
                {wipe.item.res}
              </p>
              <p className="detail-text">{wipe.item.caseStudy}</p>
            </div>
            <button className="close-btn" onClick={closeWipe}>
              ✕
            </button>
          </div>
        )}
      </div>

      {/* FLOAT WA */}
      <a
        href="https://wa.me/543571619535"
        target="_blank"
        className="wa-float"
        aria-label="WhatsApp"
      >
        <Icons.WA />
      </a>
    </div>
  );
}
