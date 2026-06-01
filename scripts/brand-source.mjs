// Stratum mark + logo system — shared source of truth.
// Rendered by scripts/build-brand-assets.mjs into all raster exports,
// and emitted as standalone SVGs into public/.
//
// Geometry (canvas 512x512):
//   Three solid horizontal slabs, stacked center, top slab nudged right
//   to imply "the chosen one". Bottom→top: blue → orange → magenta.

export const BRAND = {
  ink: "#0B0B1F",
  cream: "#FFF7F4",
  white: "#FFFFFF",
  // slab colors, bottom → top
  slab1: "#4D7CFF",
  slab2: "#FF7A45",
  slab3: "#FF3D7F",
  // primary single accent (used for theme_color, tile color)
  accent: "#FF3D7F",
};

/** Returns just the <g> contents of the mark on a 512x512 canvas. */
export function markBody({ mono = null } = {}) {
  // mono: null = full color, "ink" = ink-only, "cream" = cream-only
  const c1 = mono === "ink" ? BRAND.ink : mono === "cream" ? BRAND.cream : BRAND.slab1;
  const c2 = mono === "ink" ? BRAND.ink : mono === "cream" ? BRAND.cream : BRAND.slab2;
  const c3 = mono === "ink" ? BRAND.ink : mono === "cream" ? BRAND.cream : BRAND.slab3;

  const w = 360, h = 360;
  const x = (512 - w) / 2;
  const y = (512 - h) / 2;
  const bh = 92, gap = 18, r = 18;
  const widths = [w, w * 0.82, w * 0.62];
  const offsetTop = 28; // top slab nudged right

  return widths
    .map((bw, i) => {
      const by = y + i * (bh + gap);
      const bx = x + (i === 0 ? offsetTop : 0);
      const fill = [c1, c2, c3][i];
      return `<rect x="${bx.toFixed(2)}" y="${by.toFixed(2)}" width="${bw.toFixed(2)}" height="${bh}" rx="${r}" fill="${fill}"/>`;
    })
    .reverse() // draw bottom-first so top slab paints last
    .join("");
}

/** Standalone mark SVG (square). */
export function markSVG({ size = 512, mono = null, bg = null } = {}) {
  const bgRect = bg ? `<rect width="${size}" height="${size}" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">${bgRect}${markBody({ mono })}</svg>`;
}

/** Horizontal lockup: mark + wordmark. */
export function lockupSVG({ dark = false, mono = null } = {}) {
  const W = 1200, H = 320;
  const inkColor = dark ? BRAND.cream : BRAND.ink;
  const textFill = mono ? (mono === "cream" ? BRAND.cream : BRAND.ink) : inkColor;
  const markScale = 220 / 512;
  const markX = 80;
  const markY = (H - 220) / 2;
  const textX = markX + 220 + 36;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <g transform="translate(${markX} ${markY}) scale(${markScale})">${markBody({ mono })}</g>
  <text x="${textX}" y="${H / 2 - 6}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="84" font-weight="900" letter-spacing="-3" fill="${textFill}">Stack</text>
  <text x="${textX}" y="${H / 2 + 84}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="84" font-weight="900" letter-spacing="-3" fill="${textFill}">Architect</text>
</svg>`;
}

/** Vertical stacked lockup. */
export function stackedSVG({ dark = false, mono = null } = {}) {
  const W = 640, H = 880;
  const textFill = mono ? (mono === "cream" ? BRAND.cream : BRAND.ink) : dark ? BRAND.cream : BRAND.ink;
  const markScale = 380 / 512;
  const markX = (W - 380) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <g transform="translate(${markX} 60) scale(${markScale})">${markBody({ mono })}</g>
  <text x="${W / 2}" y="560" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="92" font-weight="900" letter-spacing="-3" fill="${textFill}">Stack</text>
  <text x="${W / 2}" y="660" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="92" font-weight="900" letter-spacing="-3" fill="${textFill}">Architect</text>
  <text x="${W / 2}" y="740" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="32" font-weight="600" letter-spacing="2" fill="${textFill}" opacity="0.6">FOR LOVABLE</text>
</svg>`;
}
