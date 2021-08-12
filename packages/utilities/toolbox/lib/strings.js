export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export function convertToUnit(str, unit = 'px') {
  if (str == null || str === '') {
    return undefined;
  }

  if (Number.isNaN(str)) {
    return String(str);
  }

  return `${Number(str)}${unit}`;
}
