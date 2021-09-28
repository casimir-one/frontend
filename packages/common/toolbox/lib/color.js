import ColorThief from 'colorthief';
import chroma from 'chroma-js';
import { chunkIt } from '@array-utils/chunk-it';

// BASIC HELPERS

export const rgbToHex = (rgb) => chroma(rgb).hex();

export const setAlpha = (color, alpha = 0.5) => {
  if (!color) return false;
  return chroma(color).alpha(alpha);
};

export const isDarkColor = (color = '#000') => chroma(color).luminance() < 0.5;

// GET DOMINANT

const genTempImage = (imageURL) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  // const googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
  // img.src = googleProxyURL + encodeURIComponent(imageURL);
  img.src = imageURL;

  return img;
};

export const getDominantColor = (imageURL) => {
  if (!imageURL) return false;

  const colorThief = new ColorThief();
  const image = genTempImage(imageURL);

  return new Promise((resolve, reject) => {
    try {
      image.addEventListener('load', () => {
        resolve(colorThief.getColor(image));
      });
    } catch (err) {
      reject(err);
    }
  });
};

// GENERATE PALETTE

export const genColorsGradient = (
  colorsCount = 24,
  gradientRange = [0, 100],
  palette = [
    '#feff9a',
    '#7eccbb',
    '#4cb1d0',
    '#5569ed',
    '#6846c0'
  ]
) => {
  const gradient = chroma.scale(palette)
    .mode('rgb')
    .correctLightness()
    .colors(1000);
  const start = Math.floor(gradient.length * (gradientRange[0] / 100));
  const length = Math.floor(gradient.length * ((gradientRange[1] - gradientRange[0]) / 100));
  const resultGradient = gradient.splice(start, length);
  const chunks = chunkIt(resultGradient).count(colorsCount);

  const result = [];
  for (const c of chunks) {
    result.push(c[Math.floor(c.length / 2)]);
  }

  return result;
};

export const genColorPair = (
  bg = '#000',
  darkOnly = false,
  lightOnly = false
) => {
  const luminance = chroma(bg).luminance();
  const delta = 3 - 0.1 * luminance;
  const dark = chroma(bg).darken(delta).hex();
  const light = chroma(bg).brighten(delta).hex();

  if (darkOnly) {
    return dark;
  }

  if (lightOnly) {
    return light;
  }

  return luminance > 0.5 ? dark : light;
};

export const genColorsPalette = (options = {}) => {
  const {
    colorsCount,
    gradientRange,
    palette
  } = options;

  const colors = genColorsGradient(colorsCount, gradientRange, palette);

  return colors.map((color) => ({
    background: color,
    foreground: genColorPair(color),
    foregroundDark: genColorPair(color, true),
    foregroundLight: genColorPair(color, false, true)
  }));
};
