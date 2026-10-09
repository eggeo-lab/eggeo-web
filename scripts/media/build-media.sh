#!/bin/bash
# Genera los medios optimizados de la web a partir de la biblioteca ../eggeo-material (solo lectura).
# Requiere macOS (sips + swiftc). No forma parte de `npm run build`: los resultados se versionan en public/media.
#   bash scripts/media/build-media.sh            → procesa todo
#   ONLY=slg bash scripts/media/build-media.sh   → procesa solo los ids que empiezan con "slg"
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LIB="${EGGEO_MATERIAL:-$ROOT/../eggeo-material}"
OUT="$ROOT/public/media"
MANIFEST="$ROOT/src/content/media.json"
TMP="$(mktemp -d)"
VTRANS="$TMP/vtrans"
TRIM="$TMP/trim"
ONLY="${ONLY:-}"

[ -d "$LIB" ] || { echo "No encuentro la biblioteca en $LIB (definí EGGEO_MATERIAL)"; exit 1; }
swiftc -O "$ROOT/scripts/media/vtrans.swift" -o "$VTRANS" 2>/dev/null
swiftc -O "$ROOT/scripts/media/trim.swift" -o "$TRIM" 2>/dev/null
mkdir -p "$OUT"
ENTRIES=()

dims() { sips -g pixelWidth -g pixelHeight "$1" | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w" "h}'; }
want() { [ -z "$ONLY" ] || [[ "$1" == $ONLY* ]]; }

# img <id> <origen> <anchos...>  → public/media/<id>-<ancho>.avif|jpg
img() {
  local id="$1" src="$2"; shift 2
  want "$id" || return 0
  local dir; dir="$(dirname "$OUT/$id")"; mkdir -p "$dir"
  read -r W H < <(dims "$src")
  local made=()
  for w in "$@"; do
    [ "$w" -gt "$W" ] && w="$W"
    sips -s format png --resampleWidth "$w" "$src" --out "$TMP/r.png" >/dev/null
    # Chrome no decodifica algunos AVIF grandes con alto impar (mosaico de sips): se recorta a par.
    read -r rw rh < <(dims "$TMP/r.png")
    [ $((rh % 2)) -eq 1 ] && sips -c $((rh - 1)) "$rw" "$TMP/r.png" >/dev/null
    sips -s format avif -s formatOptions "${AVIFQ:-52}" "$TMP/r.png" --out "$OUT/$id-$w.avif" >/dev/null
    sips -s format jpeg -s formatOptions "${JPGQ:-74}" "$TMP/r.png" --out "$OUT/$id-$w.jpg" >/dev/null
    made+=("$w")
  done
  local list; list="$(IFS=,; echo "${made[*]}")"
  ENTRIES+=("\"$id\": {\"w\": $W, \"h\": $H, \"sizes\": [$list]}")
  echo "img  $id ${W}x${H} → [$list]"
}

# png <id> <origen> <alto>  → logos con transparencia, recortados al contenido
png() {
  local id="$1" src="$2" h="$3"
  want "$id" || return 0
  mkdir -p "$(dirname "$OUT/$id")"
  "$TRIM" "$src" "$OUT/$id.png" "$h" >/dev/null
  read -r W H < <(dims "$OUT/$id.png")
  ENTRIES+=("\"$id\": {\"w\": $W, \"h\": $H, \"png\": true}")
  echo "png  $id ${W}x${H}"
}

# vid <id> <origen> <dimMáx> <kbps> <inicio> <duración|0> <audio 0|1> <posterSeg>
vid() {
  local id="$1" src="$2" max="$3" kbps="$4" start="$5" dur="$6" audio="$7" at="$8"
  want "$id" || return 0
  mkdir -p "$(dirname "$OUT/$id")"
  local out; out="$("$VTRANS" "$src" "$OUT/$id.mp4" "$max" "$kbps" "$start" "$dur" "$audio" "$TMP/poster.png" "$at")"
  echo "vid  $out" | head -1
  read -r W H < <(dims "$TMP/poster.png")
  sips -s format avif -s formatOptions 52 "$TMP/poster.png" --out "$OUT/$id-poster.avif" >/dev/null
  sips -s format jpeg -s formatOptions 74 "$TMP/poster.png" --out "$OUT/$id-poster.jpg" >/dev/null
  ENTRIES+=("\"$id\": {\"w\": $W, \"h\": $H, \"video\": true}")
}

C="$LIB/CLIENTES"
R="$LIB/EGGEO - REELS"
B="$LIB/EGGEO - BRANDING"

# ---------- La Gorgona (SLG) — branding ----------
img work/slg/cover        "$C/SLG/ABOUT US/SLG-23.png"              540 1080
img work/slg/medusa       "$C/SLG/BACKGROUNDS-VISUALS/SLG-14.png"   540 1080
img work/slg/medusa-neg   "$C/SLG/BACKGROUNDS-VISUALS/SLG-16.png"   540 1080
img work/slg/about        "$C/SLG/ABOUT US/SLG-22.png"              540 1080
img work/slg/services     "$C/SLG/ABOUT US/SLG-24.png"              540 1080
img work/slg/texture      "$C/SLG/BACKGROUNDS-VISUALS/SLG-17.png"   540 1080
img work/slg/isotype      "$C/SLG/LOGOS-ICONS/SLG-11.png"           540 1080
img work/slg/isotype-neg  "$C/SLG/LOGOS-ICONS/SLG-12.png"           540 1080
img work/slg/monogram     "$C/SLG/LOGOS-ICONS/SLG-3.png"            540 1080
img work/slg/wordmark     "$C/SLG/LOGOS/SLG - VISUAL-1.png"         540 1080
img work/slg/piece-1      "$C/SLG/SERVICES/SLG-28.png"              540 1080
img work/slg/piece-2      "$C/SLG/SERVICES/SLG-30.png"              540 1080
img work/slg/piece-3      "$C/SLG/SERVICES/SLG-34.png"              540 1080
img work/slg/piece-4      "$C/SLG/SERVICES/SLG-37.png"              540 1080
vid work/slg/loop-wordmark "$C/SLG/BACKGROUNDS-VISUALS/SLG-19.mp4"  900 900 0 0 0 2.5
vid work/slg/loop-about    "$C/SLG/ABOUT US/SLG-21.mp4"             900 900 0 0 0 2.5

# ---------- Heybon — dirección de arte, carruseles y pauta ----------
H1="$C/HEYBON/02 - CARROUSELES/HEY-SEPT-1"
H2="$C/HEYBON/02 - CARROUSELES/HEY-SEPT-2"
HP="$C/HEYBON/00 - PAUTA/PAUTA - BOLSA - LIFESTYLE"
img work/heybon/cover     "$H1/HEYBON_CARRETE_SEPT_V2_01.png"       540 1080
for i in 02 03 04 05 06; do img "work/heybon/look-$i" "$H1/HEYBON_CARRETE_SEPT_V2_$i.png" 540 1080; done
for i in 01 02 03 04; do img "work/heybon/process-$i" "$H2/HEYBON_CARRETE_SEPT_2_V2_$i.png" 540 1080; done
img work/heybon/ad-community "$HP/B - COMMUNITY-ATTITUDE/HEYBON_PAUTA_BOLSAS_COMMUNITY_FEED_FINAL.jpg" 540 1080
img work/heybon/ad-lifestyle "$HP/A - LIFESTYLE-HANGOUT/HEYBON_BOLSAS_V3_A_LIFESTYLE_FEED_1080x1350.jpg" 540 1080
img work/heybon/story-sale   "$C/HEYBON/03 - STORYS/HEYBON_50OFF_BUZOS_STORY_1080x1920.jpg" 540 1080

# ---------- Egran — contenido para redes y reel ----------
for i in 1 2 3 4 5 6; do img "work/egran/post-$i" "$C/EGRAN/EGR-OCT-3/$i.png" 540 1080; done
img work/egran/forecast   "$C/EGRAN/5.png"                          540 1080
vid work/egran/reel       "$C/EGRAN/EGR-REEL-MAMA.mp4"              960 1300 0 0 1 8.5
vid work/egran/teaser     "$C/EGRAN/EGR-REEL-MAMA.mp4"              720 850 4 7 0 4.5

# ---------- AGPNYC — video con IA ----------
vid work/agpnyc/film      "$C/AGPNYC/AGPNYC-10TH-v4.mp4"            960 1400 0 0 1 14.6
vid work/agpnyc/teaser    "$C/AGPNYC/AGPNYC-10TH-v4.mp4"            720 850 12.6 6 0 1.9

# ---------- Gata Maula y Risata (fotos ya publicadas en la web) ----------
# Fotos sin originales de mayor tamaño: máxima resolución disponible y más calidad.
AVIFQ=72 JPGQ=86 img work/gata-maula/cover "$ROOT/media-src/gata-maula.jpeg" 800 1200 1600
AVIFQ=72 JPGQ=86 img work/risata/cover     "$ROOT/media-src/risata.jpeg"     800 1200 1600

# ---------- Gata Maula: anuncio de la campaña y capítulo 5 de «Gata vs Gata» ----------
vid work/gata-maula/ad        "$C/GATA/GATA ABUELO.mp4"                  960 1300 0 0 1 9.2
vid work/gata-maula/series-5  "$C/GATA/GATAvsGATA5.mp4"                  960 1100 0 0 1 3.6

# ---------- Campaña propia «Mirá con los ojos de EGGEO» ----------
vid campaign/eyes         "$R/EGGEO-IG-AD/EGGEO-IG-AD.mp4"          960 1000 1.5 7 0 1.5
vid campaign/ia           "$R/IA-EGGEO.mp4"                         960 1000 0 0 0 1.5
vid campaign/mira         "$B/Untitled/Untitled-42.mp4"             720 700 0 0 0 2.2

# ---------- Logos de clientes (negros, transparentes) ----------
for f in "$ROOT"/media-src/logos/black_*.png; do
  n="$(basename "$f" .png)"; n="${n#black_}"; n="${n%-logo}"
  png "clients/$(echo "$n" | tr 'A-Z' 'a-z')" "$f" 160
done

# ---------- Manifiesto (se fusiona con el existente: ONLY= actualiza solo esos ids) ----------
{
  echo "{"
  for i in "${!ENTRIES[@]}"; do
    sep=","; [ "$i" -eq $(( ${#ENTRIES[@]} - 1 )) ] && sep=""
    echo "  ${ENTRIES[$i]}$sep"
  done
  echo "}"
} > "$TMP/new.json"
python3 -I - "$MANIFEST" "$TMP/new.json" <<'PY'
import json, os, sys
path, new = sys.argv[1], json.load(open(sys.argv[2]))
old = json.load(open(path)) if os.path.exists(path) else {}
old.update(new)
with open(path, "w") as f:
    f.write("{\n" + ",\n".join(f'  {json.dumps(k)}: {json.dumps(v)}' for k, v in sorted(old.items())) + "\n}\n")
PY
echo "manifiesto → $MANIFEST"
rm -rf "$TMP"
find "$OUT" -name "*.sb-*" -delete
du -sh "$OUT"
