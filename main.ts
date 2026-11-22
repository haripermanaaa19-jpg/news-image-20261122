// Entry for make.fun's news-image-20261122: one image summing up the world
// news of Sunday 22 November 2026. The finished front page lives beside this
// file as entry.png, and this program's whole job is to deliver it to the
// output directory unchanged, so the grader sees exactly the bytes committed
// here.
//
// Run it the way the grader does, with MAKEFUN_OUTPUT_DIR standing in for
// /output when trying it out locally:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// The gate's caps: at most 1 MiB, and the bytes must be a whole PNG or JPEG
// (it tells them apart by magic bytes, so the payload is checked the same
// way here before anything is written out).
const MAX_BYTES = 1_048_576;

function looksLikeImage(bytes: Buffer): boolean {
  const isPng = bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  const isJpeg = bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  return isPng || isJpeg;
}

const payload = readFileSync(new URL('./entry.png', import.meta.url));
if (payload.length > MAX_BYTES) {
  throw new Error(`entry.png is ${payload.length} bytes, over the ${MAX_BYTES}-byte cap`);
}
if (!looksLikeImage(payload)) {
  throw new Error('entry.png is neither a PNG nor a JPEG by its first bytes');
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), payload);
