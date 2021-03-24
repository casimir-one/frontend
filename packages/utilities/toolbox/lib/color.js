import ColorThief from 'colorthief';
import chroma from 'chroma-js';

const genTempImage = (imageURL) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';

  // const googleProxyURL = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=';
  // img.src = googleProxyURL + encodeURIComponent(imageURL);
  // img.src = imageURL;

  return img;
}

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
}

export const rgbToHex = (rgb) => {
  return chroma(rgb).hex();
}

export const setAlpha = (color, alpha = 0.5) => {
  if (!color) return false;
  return chroma(color).alpha(alpha);
}

export const isDarkColor = (color = '#000') => {
  console.log(111,color)
  return chroma(color).luminance() < 0.5;
}
