/**
 * Paragraph parser
 * @param {Object} data
 * @param {string} data.text
 * @returns {string}
*/
export const paragraph = ({ text }) => `<p class="de-paragraph">${text || ''}</p>`;
