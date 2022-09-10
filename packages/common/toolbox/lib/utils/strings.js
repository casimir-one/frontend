import { isNil } from '../verification';

/** @deprecated */

/**
 * Strip html
 * @param {string} html
 * @returns {string}
 */
export const stripHtml = html => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Convert string to unit
 * @param {string} str
 * @param {string} unit
 * @returns {string}
 */
export function convertToUnit(str, unit = 'px') {
  if (isNil(str) || str === '' || str === ' ') {
    return undefined;
  }

  if (Number.isNaN(str) || Number.isNaN(parseFloat(str)) || Number.isNaN(Number(str))) {
    return String(str);
  }

  return `${Number(str)}${unit}`;
}