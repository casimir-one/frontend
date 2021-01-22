import { isJsonString } from './verification';

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
