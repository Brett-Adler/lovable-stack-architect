#!/usr/bin/env node
// Generate the entire brand asset set from scripts/brand-source.mjs.
// Run:  node scripts/build-brand-assets.mjs
//
// Outputs land in public/ (PWA, favicons, social) and are committed.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { BRAND, markBody, markSVG, lockupSVG, stackedSVG } from "./brand-source.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, "..", "public");
mkdirSync(PUBLIC, { recursive: true });

const write = (rel, buf) => {
  const p = resolve(PUBLIC, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, buf);
  console.log("✓", rel);
};

const renderPng = async (svg, size, { background = null } = {}) => {
  let pipe = sharp(Buffer.from(svg), { density: 384 }).resize(size, size, { fit: "contain", background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } });
  if (background) pipe = pipe.flatten({ background });
  return pipe.png({ compressionLevel: 9 }).toBuffer();
};

// ---- SVGs ----
write("logo-mark.svg", Buffer.from(markSVG()));
write("logo-mark-mono.svg", Buffer.from(markSVG({ mono: "ink" })));
write("logo.svg", Buffer.from(lockupSVG()));
write("logo-dark.svg", Buffer.from(lockupSVG({ dark: true })));
write("logo-stacked.svg", Buffer.from(stackedSVG()));
write("logo-mono-light.svg", Buffer.from(lockupSVG({ mono: "ink" })));
write("logo-mono-dark.svg", Buffer.from(lockupSVG({ mono: "cream", dark: true })));

// ---- Favicons ----
// Tight crop: the mark only fills ~70% of its 512 canvas. Re-frame for icons
// by rendering an SVG with the body scaled up and centered.
const tightMarkSVG = (bg = null) => {
  const inner = markBody();
  const scale = 1.28; // scale up the body within the viewBox
  const bgRect = bg ? `<rect width="512" height="512" fill="${bg}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${bgRect}<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${inner}</g></svg>`;
};
const tight = tightMarkSVG();

const faviconSizes = [16, 32, 48, 64, 96, 192, 512];
for (const s of faviconSizes) {
  write(`favicon-${s}.png`, await renderPng(tight, s));
}

// .ico (16/32/48 multi-res, opaque cream so it pops on dark browser chrome)
const icoBg = { r: 0xFF, g: 0xF7, b: 0xF4, alpha: 1 };
const icoSrcs = await Promise.all(
  [16, 32, 48].map((s) => renderPng(tightMarkSVG(BRAND.cream), s, { background: icoBg }))
);
write("favicon.ico", await pngToIco(icoSrcs));

// ---- Apple touch (180x180, opaque cream) ----
write(
  "apple-touch-icon.png",
  await renderPng(tightMarkSVG(BRAND.cream), 180, { background: icoBg })
);

// ---- Android / PWA ----
write("android-chrome-192.png", await renderPng(tightMarkSVG(BRAND.cream), 192, { background: icoBg }));
write("android-chrome-512.png", await renderPng(tightMarkSVG(BRAND.cream), 512, { background: icoBg }));

// Maskable: needs ~10% safe-zone padding (icon at ~80% of canvas)
const maskableSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="${BRAND.cream}"/><g transform="translate(256 256) scale(0.85) translate(-256 -256)">${markBody()}</g></svg>`;
write("maskable-512.png", await renderPng(maskableSVG, 512, { background: icoBg }));

// ---- Microsoft tiles (opaque, accent background) ----
const tileBg = { r: 0xFF, g: 0x3D, b: 0x7F, alpha: 1 };
const tileSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="${BRAND.accent}"/><g transform="translate(256 256) scale(0.78) translate(-256 -256)">${markBody({ mono: "cream" })}</g></svg>`;
write("mstile-150.png", await renderPng(tileSVG, 150, { background: tileBg }));
write("mstile-310.png", await renderPng(tileSVG, 310, { background: tileBg }));

// ---- OG / social cards ----
// 1200x630 hero with stacked mark on left + headline on right.
const ogCardSVG = ({ w, h, headline = "Pick the right backend for your Lovable app", kicker = "LOVABLE STACK ARCHITECT", dark = false } = {}) => {
  const bg = dark ? BRAND.ink : BRAND.cream;
  const ink = dark ? BRAND.cream : BRAND.ink;
  const muted = dark ? "rgba(255,247,244,0.65)" : "rgba(11,11,31,0.6)";
  const markSize = Math.min(h - 160, 360);
  const markX = 80;
  const markY = (h - markSize) / 2;
  const textX = markX + markSize + 56;
  // Wrap headline into up to 3 lines naively
  const words = headline.split(" ");
  const maxPerLine = Math.ceil(words.length / 3);
  const lines = [];
  for (let i = 0; i < words.length; i += maxPerLine) lines.push(words.slice(i, i + maxPerLine).join(" "));
  const lineHeight = 84;
  const headlineFontSize = 72;
  const totalH = lines.length * lineHeight;
  const textTop = (h - totalH) / 2;

  // Gradient bar accent under kicker
  const grad = `<defs><linearGradient id="bar" x1="0" x2="1"><stop offset="0%" stop-color="${BRAND.slab1}"/><stop offset="50%" stop-color="${BRAND.slab2}"/><stop offset="100%" stop-color="${BRAND.slab3}"/></linearGradient></defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${grad}
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <g transform="translate(${markX} ${markY}) scale(${markSize / 512})">${markBody()}</g>
  <rect x="${textX}" y="${textTop - 52}" width="64" height="6" rx="3" fill="url(#bar)"/>
  <text x="${textX}" y="${textTop - 24}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="3" fill="${muted}">${kicker}</text>
  ${lines.map((ln, i) => `<text x="${textX}" y="${textTop + (i + 1) * lineHeight - 18}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="${headlineFontSize}" font-weight="900" letter-spacing="-2" fill="${ink}">${ln}</text>`).join("")}
  <text x="${textX}" y="${h - 80}" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="500" fill="${muted}">Side-by-side comparator · 10 platforms · open-source template</text>
</svg>`;
};

const ogBg = { r: 0xFF, g: 0xF7, b: 0xF4, alpha: 1 };
write("og-image.png", await sharp(Buffer.from(ogCardSVG({ w: 1200, h: 630 })), { density: 192 }).resize(1200, 630).flatten({ background: ogBg }).png({ compressionLevel: 9 }).toBuffer());
write("og-image-square.png", await sharp(Buffer.from(ogCardSVG({ w: 1200, h: 1200 })), { density: 192 }).resize(1200, 1200).flatten({ background: ogBg }).png({ compressionLevel: 9 }).toBuffer());
write("twitter-card.png", await sharp(Buffer.from(ogCardSVG({ w: 1200, h: 675 })), { density: 192 }).resize(1200, 675).flatten({ background: ogBg }).png({ compressionLevel: 9 }).toBuffer());
write("linkedin-share.png", await sharp(Buffer.from(ogCardSVG({ w: 1200, h: 627 })), { density: 192 }).resize(1200, 627).flatten({ background: ogBg }).png({ compressionLevel: 9 }).toBuffer());
write("facebook-share.png", await sharp(Buffer.from(ogCardSVG({ w: 1200, h: 630 })), { density: 192 }).resize(1200, 630).flatten({ background: ogBg }).png({ compressionLevel: 9 }).toBuffer());

// ---- Email header (600x200, opaque, email-safe PNG) ----
const emailSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
  <rect width="1200" height="400" fill="${BRAND.cream}"/>
  <g transform="translate(80 80) scale(${240 / 512})">${markBody()}</g>
  <text x="360" y="200" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="56" font-weight="900" letter-spacing="-2" fill="${BRAND.ink}">Stack Architect</text>
  <text x="360" y="248" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="22" font-weight="500" fill="rgba(11,11,31,0.6)">Pick the right backend for your Lovable app</text>
</svg>`;
write("email-header.png", await sharp(Buffer.from(emailSVG), { density: 192 }).resize(600, 200).flatten({ background: ogBg }).png({ compressionLevel: 9 }).toBuffer());

// ---- Splash (2048x2732, light + dark) ----
const splashSVG = (dark) => {
  const bg = dark ? BRAND.ink : BRAND.cream;
  const ink = dark ? BRAND.cream : BRAND.ink;
  const W = 2048, H = 2732;
  const markSize = 720;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <g transform="translate(${(W - markSize) / 2} ${H / 2 - markSize / 2 - 80}) scale(${markSize / 512})">${markBody()}</g>
  <text x="${W / 2}" y="${H / 2 + markSize / 2 + 60}" text-anchor="middle" font-family="Inter, 'Helvetica Neue', Arial, sans-serif" font-size="96" font-weight="900" letter-spacing="-3" fill="${ink}">Stack Architect</text>
</svg>`;
};
write("splash-light.png", await sharp(Buffer.from(splashSVG(false)), { density: 144 }).resize(2048, 2732).flatten({ background: ogBg }).png({ compressionLevel: 9 }).toBuffer());
const darkBg = { r: 0x0B, g: 0x0B, b: 0x1F, alpha: 1 };
write("splash-dark.png", await sharp(Buffer.from(splashSVG(true)), { density: 144 }).resize(2048, 2732).flatten({ background: darkBg }).png({ compressionLevel: 9 }).toBuffer());

console.log("\nAll brand assets built.");
