/**
 * List parser
 * @param {Object} data
 * @param {string} data.style
 * @param {Array} data.items
 * @returns {string}
*/
export const list = ({ style, items }) => {
  const parent = style === 'ordered' ? 'ol' : 'ul';
  const listItems = items
    .map((item) => {
      const itemContent = item instanceof Object ? item.content : item;
      return `<li class="de-list-item">${itemContent}</li>`;
    })
    .join('');

  return `<${parent} class="de-list">${listItems}</${parent}>`;
};
