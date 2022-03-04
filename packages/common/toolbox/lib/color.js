import ColorThief from 'colorthief';
import chroma from 'chroma-js';
import { chunkIt } from '@array-utils/chunk-it';

// BASIC HELPERS

/**
  * @typedef {string|Object|number|Array.<number>} Color
*/

/**
  * Convert from rgb to hex
  * @param {Color} rgb
  * @returns {string}
*/
export const rgbToHex = (rgb) => chroma(rgb).hex();

/**
  * Set the color opacity
  * @param {Color} color
  * @param {number} alpha
  * @returns {Object} Chroma object
*/
export const setAlpha = (color, alpha = 0.5) => {
  if (!color) return false;
  return chroma(color).alpha(alpha);
};

/**
  * Checks if color relative brightness is less than 0.5
  * @param {Color} color
  * @returns {boolean}
*/
export const isDarkColor = (color = '#000') => chroma(color).luminance() < 0.5;

// GET DOMINANT

/**
  * Generate image with upload resolution from another source
  * @param {string} imageURL
  * @returns {Image}
*/
const genTempImage = (imageURL) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  // const googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
  // img.src = googleProxyURL + encodeURIComponent(imageURL);
  img.src = imageURL;

  return img;
};

/**
  * Get dominant color from image by url
  * @param {string} imageURL
  * @returns {Promise} Promise object represents the dominant color from an image
*/
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

/**
  * Generate colors gradient
  * @param {number} [colorsCount=24]
  * @param {Array.<number>} [gradientRange=[0, 24]]
  * @param {Array.<string>} [palette=['#feff9a', '#7eccbb', '#4cb1d0', '#5569ed', '#6846c0']]
  * @returns {Array.<string>}
*/
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

/**
  * Generate color pair
  * @param {Color} [bg=#000]
  * @param {boolean} [darkOnly=false]
  * @param {boolean} [lightOnly=false]
  * @returns {string}
*/
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

/**
  * Generate color palette
  * @param {Object} options
  * @param {number} options.colorsCount
  * @param {Array.<number>} options.gradientRange
  * @param {Array.<string>} options.palette
  * @returns {Array.<Object>}
*/
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
