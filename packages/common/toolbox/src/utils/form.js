import { isJsonString } from '../verification';
import { extractFilesFromModel, replaceFileWithName } from './files';

/**
  * Parse form data
  * @param {FormData} formData
  * @returns {Object}
*/
export const parseFormData = (formData) => {
  if (!(formData instanceof FormData)) {
    throw new Error('Expected formData parameter to be an instance of FormData');
  }

  return [...formData.entries()]
    .reduce((memo, ent) => ({
      ...memo,
      ...{ [ent[0]]: (isJsonString(ent[1]) ? JSON.parse(ent[1]) : ent[1]) }
    }), {});
};

/**
  * Create form data
  * @param {Object} model
  * @returns {FormData}
*/
export const createFormData = (model) => {
  const formData = new FormData();
  const files = extractFilesFromModel(model);
  const data = replaceFileWithName(model);

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, JSON.stringify(value));
  }

  for (const file of files) {
    formData.append(...file);
  }

  return formData;
};
