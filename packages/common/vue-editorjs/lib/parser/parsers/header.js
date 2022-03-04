/**
 * Header parser
 * @param {Object} data
 * @param {string} data.text
 * @param {number} data.level
 * @returns {string}
*/
export const header = ({ text, level }) => `<h${level} class="de-header">${text || ''}</h${level}>`;
