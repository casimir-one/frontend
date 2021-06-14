import { isJsonString } from './validation';
import { extractFilesFromModel, replaceFileWithName } from './files';

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
