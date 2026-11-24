import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One Emoji, One Dream Vacation: the desert island.
// White sand, one palm, turquoise water, nobody else around — the whole
// dream in a single glyph. A stranger sees it and starts pricing flights.
const EMOJI = "\u{1F3DD}\u{FE0F}";
// U+1F3DD is 4 UTF-8 bytes, U+FE0F is 3 — the entry file must be 7 bytes.
const EXPECTED_BYTES = 7;

// Guard: the entry must be exactly one emoji — a single pictographic
// code point, optionally followed by the variation selector that asks
// for the emoji presentation. Anything else is refused, never written.
function assertSingleEmoji(text: string): void {
  const points = [...text];
  if (points.length < 1 || points.length > 2) {
    throw new Error(`entry must be exactly one emoji, got ${points.length} code points`);
  }
  if (!/\p{Extended_Pictographic}/u.test(points[0])) {
    throw new Error("entry must start with a pictographic code point");
  }
  if (points.length === 2 && points[1] !== "\u{FE0F}") {
    throw new Error("second code point must be the emoji variation selector U+FE0F");
  }
  if (Buffer.byteLength(text, "utf8") !== EXPECTED_BYTES) {
    throw new Error(`entry must encode to ${EXPECTED_BYTES} bytes, got ${Buffer.byteLength(text, "utf8")}`);
  }
}

assertSingleEmoji(EMOJI);
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", EMOJI, "utf8");

// Read back and verify: the bytes on disk must be exactly the emoji's
// UTF-8 encoding — 7 bytes, no trailing newline, no extra text.
const written = readFileSync("/output/entry.txt");
const expected = Buffer.from(EMOJI, "utf8");
if (!written.equals(expected)) {
  throw new Error("entry.txt on disk does not match the emoji exactly");
}
