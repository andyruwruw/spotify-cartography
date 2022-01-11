// https://stackoverflow.com/questions/17433015/change-the-hue-of-a-rgb-color-in-javascript\
import { Color } from "three";

/**
 * Normalizes RGB values to be between 0 and 255.
 *
 * @param color 
 * @param m 
 * @returns 
 */
function normalize_rgb_value(color: number, m: number) {
  color = Math.floor((color + m) * 255);
  if (color < 0) {
    color = 0;
  }
  return color;
}

/**
 * Turns HSL color values into RGB.
 *
 * @param hsl 
 * @returns 
 */
const hslToRGB = (hsl: Record<string, number>): Record<string, number> => {
  const { h } = hsl;
  const { s } = hsl;
  const { l } = hsl;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  // eslint-disable-next-line no-mixed-operators
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

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

  r = normalize_rgb_value(r, m);
  g = normalize_rgb_value(g, m);
  b = normalize_rgb_value(b, m);

  return {
    r,
    g,
    b,
  };
};

/**
 * Turns RGB color values into HSL.
 *
 * @param rgb 
 * @returns 
 */
const rgbToHSL = (rgb: string): Record<string, number> => {
  // strip the leading # if it's there
  rgb = rgb.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (rgb.length === 3) {
    rgb = rgb.replace(/(.)/g, '$1$1');
  }

  const r = parseInt(rgb.substr(0, 2), 16) / 255;
  const g = parseInt(rgb.substr(2, 2), 16) / 255;
  const b = parseInt(rgb.substr(4, 2), 16) / 255;
  const cMax = Math.max(r, g, b);
  const cMin = Math.min(r, g, b);
  const delta = cMax - cMin;
  const l = (cMax + cMin) / 2;
  let h = 0;
  let s = 0;

  if (delta === 0) {
    h = 0;
  } else if (cMax === r) {
    h = 60 * (((g - b) / delta) % 6);
  } else if (cMax === g) {
    h = 60 * (((b - r) / delta) + 2);
  } else {
    h = 60 * (((r - g) / delta) + 4);
  }

  if (delta === 0) {
    s = 0;
  } else {
    s = (delta / (1 - Math.abs(2 * l - 1)));
  }

  return {
    h,
    s,
    l,
  };
};

/**
 * Changes the hue of an RGB color by a certain number of degrees.
 *
 * @param rgb 
 * @param degree 
 * @returns 
 */
const changeHue = (rgb: string, degree: number): Record<string, number> => {
  const hsl = rgbToHSL(rgb);
  hsl.h += degree;
  if (hsl.h > 360) {
    hsl.h -= 360;
  } else if (hsl.h < 0) {
    hsl.h += 360;
  }
  return hslToRGB(hsl);
};

/**
 * Retrives a color based on numerical hue.
 *
 * @param hue 
 * @returns 
 */
export const getColor = (hue: number): Color => {
  const red = '#FF0000';
  const newColor = changeHue(red, hue * 360);
  return new Color(
    newColor.r,
    newColor.g,
    newColor.b,
  );
};