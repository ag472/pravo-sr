import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create crisp SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="104" fill="url(#bgGrad)" />
  <!-- Border ring -->
  <rect x="16" y="16" width="480" height="480" rx="92" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.3" />
  
  <!-- Scales of Justice & Paragraph symbol § stylized -->
  <g transform="translate(256, 256)" filter="url(#glow)">
    <!-- Central Pillar -->
    <rect x="-6" y="-140" width="12" height="280" rx="6" fill="url(#goldGrad)" />
    <!-- Pedestal base -->
    <rect x="-60" y="140" width="120" height="16" rx="8" fill="url(#goldGrad)" />
    <rect x="-80" y="156" width="160" height="18" rx="9" fill="url(#goldGrad)" />
    <!-- Top finial -->
    <circle cx="0" cy="-148" r="16" fill="url(#goldGrad)" />
    <circle cx="0" cy="-148" r="8" fill="#0f172a" />
    <!-- Crossbeam -->
    <path d="M -160 -90 L 160 -90" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round" />
    
    <!-- Left Scale Plate & cords -->
    <path d="M -150 -84 L -190 20 M -150 -84 L -110 20" stroke="#fde68a" stroke-width="3" stroke-linecap="round" />
    <path d="M -210 20 C -210 60 -90 60 -90 20 Z" fill="url(#goldGrad)" />
    
    <!-- Right Scale Plate & cords -->
    <path d="M 150 -84 L 110 20 M 150 -84 L 190 20" stroke="#fde68a" stroke-width="3" stroke-linecap="round" />
    <path d="M 90 20 C 90 60 210 60 210 20 Z" fill="url(#goldGrad)" />

    <!-- Center Section § Emblem -->
    <circle cx="0" cy="0" r="44" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="4" />
    <text x="0" y="14" fill="#fbbf24" font-family="Georgia, serif" font-size="44" font-weight="bold" text-anchor="middle">§</text>
  </g>
  <!-- Text Label -->
  <text x="256" y="445" fill="#f8fafc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="32" font-weight="700" letter-spacing="4" text-anchor="middle">PRÁVO SR</text>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Created public/icon.svg');

// Simple minimal raw PNG writer using node zlib
function createSolidPng(width, height, isMaskable = false) {
  // Let's create an uncompressed or zlib-compressed 32-bit RGBA PNG
  const bytesPerPixel = 4;
  const rowSize = width * bytesPerPixel;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  // Background color #0f172a
  const bgR = 0x0f, bgG = 0x17, bgB = 0x2a, bgA = 0xff;
  // Gold accent #d97706
  const goldR = 0xd9, goldG = 0x77, goldB = 0x06;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;

      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gold circular ring or emblem
      if (dist > 0.65 && dist < 0.72) {
        rawData[pixelOffset] = goldR;
        rawData[pixelOffset + 1] = goldG;
        rawData[pixelOffset + 2] = goldB;
        rawData[pixelOffset + 3] = 0xff;
      } else if (dist < 0.45 && Math.abs(dx) < 0.15) {
        // Center pillar
        rawData[pixelOffset] = goldR;
        rawData[pixelOffset + 1] = goldG;
        rawData[pixelOffset + 2] = goldB;
        rawData[pixelOffset + 3] = 0xff;
      } else if (dist < 0.45 && Math.abs(dy + 0.15) < 0.05 && Math.abs(dx) < 0.4) {
        // Crossbeam
        rawData[pixelOffset] = goldR;
        rawData[pixelOffset + 1] = goldG;
        rawData[pixelOffset + 2] = goldB;
        rawData[pixelOffset + 3] = 0xff;
      } else {
        rawData[pixelOffset] = bgR;
        rawData[pixelOffset + 1] = bgG;
        rawData[pixelOffset + 2] = bgB;
        rawData[pixelOffset + 3] = bgA;
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // CRC32 implementation
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c;
  }
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createSolidPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createSolidPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createSolidPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createSolidPng(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createSolidPng(32, 32, false));

console.log('Successfully generated all PWA icons in /public!');
