const classNames = {
  table: 'de-table',
  head: 'de-head',
  body: 'de-body',
  row: 'de-row',
  cell: 'de-cell'
};

/**
 * Table parser
 * @param {Object} data
 * @param {boolean} data.withHeadings
 * @param {Array.<Array.<string>>} data.content
 * @returns {string}
*/
export const table = ({ withHeadings, content }) => {
  if (!content || content.length === 0) return '';

  let head = '';
  if (withHeadings) {
    const headCells = content[0].map((cellContent) => `<td class="${classNames.cell}">${cellContent}</td>`).join('');
    head = `<thead class="${classNames.head}"><tr class="${classNames.row}">${headCells}</tr></thead>`;
  }

  const bodyRows = content.map((row, index) => {
    if (withHeadings && index === 0) return '';
    const cells = row.map((cellContent) => `<td class="${classNames.cell}">${cellContent}</td>`).join('');
    return `<tr class="${classNames.row}">${cells}</tr>`;
  }).join('');
  const body = `<tbody class="${classNames.body}">${bodyRows}</tbody>`;

  return `<table class="${classNames.table}">${head}${body}</table>`;
};
