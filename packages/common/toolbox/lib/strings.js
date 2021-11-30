import { isNil } from 'lodash';

/** @deprecated */
export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export function convertToUnit(str, unit = 'px') {
  if (isNil(str) || str === '' || str === ' ') {
    return undefined;
  }

  if (Number.isNaN(str) || Number.isNaN(parseFloat(str)) || Number.isNaN(Number(str))) {
    return String(str);
  }

  return `${Number(str)}${unit}`;
}
