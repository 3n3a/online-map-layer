/* Color Utils */
// TODO: implement for marker color, gen based on layerName

/**
 * Eurotime Convert Decimal to Hex Color Value
 *
 * **Only works for eurotime**
 *
 * @param colorValue
 */
export function convertDecToHex(colorValue: number): string {
  const convert = colorValue & 0x00ffffff;
  return `#${convert.toString(16).padStart(6, '0')}`;
}

/**
 * Converts an HSL color value to a hex string.
 *
 * Usage:
 *
 * - h: hue (0–360)
 * - s: saturation (0–100)
 * - l: lightness (0–100)
 *
 * @param h
 * @param s
 * @param l
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (value: number): string => {
    const hex = Math.round((value + m) * 255).toString(16);
    return hex.padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * xmur3 hash function to generate a seed from a string
 *
 * @param str string
 * @return number
 */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

/**
 * mulberry32 PRNG
 *
 * a function that generates a number between 0 and 1
 *
 * @param a number
 * @return number
 */
function mulberry32(a: number): () => number {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates a random dark hex color.
 *
 * Description:
 *
 * By limiting lightness (20%–40%), the color is dark enough to provide good contrast for white text.
 *
 * @param seed string
 * @return string
 */
export function generateRandomDarkHexColor(seed: string): string {
  const seedFn = xmur3(seed);
  const rand = mulberry32(seedFn());

  const hue = Math.floor(rand() * 360); // 0 to 359
  const saturation = Math.floor(rand() * 50) + 50; // 50% to 100%
  const lightness = Math.floor(rand() * 21) + 20; // 20% to 40%

  return hslToHex(hue, saturation, lightness);
}
