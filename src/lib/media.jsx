// Imágenes y videos responsivos a partir de src/content/media.json (generado por scripts/media).
import React, { useEffect, useRef, useState } from "react";
import MEDIA from "../content/media.json";
import { usePrefersReducedMotion } from "./hooks.js";

const mediaUrl = (id, suffix) => `/media/${id}${suffix}`;

let avifCheck;
/** Detecta una sola vez si el navegador decodifica AVIF (para elegir el formato del poster). */
function supportsAvif() {
  if (!avifCheck) {
    avifCheck = new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0);
      img.onerror = () => resolve(false);
      img.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=";
    });
  }
  return avifCheck;
}

/**
 * Tamaño óptico de un logo: misma «masa visual» sin importar su proporción.
 * Los horizontales quedan más bajos y los cuadrados más altos, dentro de un rango.
 */
export function logoSize(id, base = 58) {
  const m = mediaInfo(id);
  const ratio = m.w / m.h;
  const h = Math.round(Math.min(base * 1.08, Math.max(base * 0.5, base * Math.pow(ratio, -0.4))));
  return { height: `${h}px`, width: `${Math.round(h * ratio)}px` };
}

export function mediaInfo(id) {
  const m = MEDIA[id];
  if (!m) throw new Error(`Medio inexistente: ${id}`);
  return m;
}

/** <picture> AVIF + JPEG con srcset, dimensiones reales y carga diferida por defecto. */
export function Picture({ id, alt, sizes = "100vw", priority = false, className = "", imgClassName = "", style }) {
  const m = mediaInfo(id);
  const loading = priority ? "eager" : "lazy";
  const fetchpriority = priority ? "high" : undefined;
  if (m.video) {
    return (
      <picture className={className}>
        <source type="image/avif" srcSet={mediaUrl(id, "-poster.avif")} />
        <img
          src={mediaUrl(id, "-poster.jpg")}
          alt={alt}
          width={m.w}
          height={m.h}
          loading={loading}
          decoding="async"
          fetchpriority={fetchpriority}
          className={imgClassName}
        />
      </picture>
    );
  }
  if (m.png) {
    return <img src={mediaUrl(id, ".png")} alt={alt} width={m.w} height={m.h} loading={loading} decoding="async" className={imgClassName || className} style={style} />;
  }
  const set = (ext) => m.sizes.map((w) => `${mediaUrl(id, `-${w}.${ext}`)} ${w}w`).join(", ");
  const largest = m.sizes[m.sizes.length - 1];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <img
        src={mediaUrl(id, `-${largest}.jpg`)}
        srcSet={set("jpg")}
        sizes={sizes}
        alt={alt}
        width={m.w}
        height={m.h}
        loading={loading}
        decoding="async"
        fetchpriority={fetchpriority}
        className={imgClassName}
      />
    </picture>
  );
}

/**
 * Video mudo en loop que solo se reproduce mientras está en pantalla.
 * Con prefers-reduced-motion o ahorro de datos queda el poster.
 */
export function LoopVideo({ id, label, className = "" }) {
  const m = mediaInfo(id);
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [poster, setPoster] = useState(undefined);

  // El atributo poster no admite carga diferida: se asigna recién cerca del viewport.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        supportsAvif().then((ok) => setPoster(mediaUrl(id, ok ? "-poster.avif" : "-poster.jpg")));
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [id]);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (saveData) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      width={m.w}
      height={m.h}
      aria-label={label}
    >
      <source src={mediaUrl(id, ".mp4")} type="video/mp4" />
    </video>
  );
}

/** Video con sonido: muestra el poster y carga el archivo recién al hacer clic. */
export function FilmPlayer({ id, label, playLabel, className = "" }) {
  const m = mediaInfo(id);
  const [playing, setPlaying] = useState(false);
  return (
    <div className={`film ${className}`} style={{ aspectRatio: `${m.w} / ${m.h}` }}>
      {playing ? (
        <video controls autoPlay playsInline width={m.w} height={m.h} poster={mediaUrl(id, "-poster.jpg")} aria-label={label}>
          <source src={mediaUrl(id, ".mp4")} type="video/mp4" />
        </video>
      ) : (
        <button type="button" className="film-play" onClick={() => setPlaying(true)} aria-label={`${playLabel}: ${label}`}>
          <Picture id={id} alt="" sizes="(max-width: 700px) 90vw, 480px" />
          <span className="film-play-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
