export const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const padStart = (
  str,
  length,
  char = '0'
) => char.repeat(Math.max(0, length - str.toString().length)) + str;

export const padEnd = (
  str,
  length,
  char = '0'
) => str + char.repeat(Math.max(0, length - str.toString().length));


