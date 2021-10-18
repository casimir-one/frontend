import qs from 'qs';
import { hasValue } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';

export const expandAttributes = (
  obj,
  idKey = 'attributeId',
  valueKey = 'value'
) => {
  const { attributes = [] } = obj;

  return {
    ...obj,
    ...{
      attributes: (attributes).reduce((acc, attr) => ({
        ...acc,
        ...{
          [attr[idKey]]: attr[valueKey]
        }
      }), {})
    }
  };
};

export const compactAttributes = (
  obj,
  idKey = 'attributeId',
  valueKey = 'value'
) => {
  const { attributes = {} } = obj;

  return {
    ...obj,
    ...{
      attributes: Object.keys(attributes)
        .map((id) => ({
          [idKey]: id,
          [valueKey]: attributes[id]
        }))
    }
  };
};

export const getAttributeFileSrc = (opts = {}) => {
  const {
    serverUrl,
    scope,
    scopeId,
    attributeId,
    filename,

    width,
    height,
    round,
    noCache,
    image,
    download
  } = opts;

  if (!filename) return null;

  const url = [
    serverUrl,
    'api',
    'attribute',
    'file',
    scope,
    scopeId,
    attributeId,
    filename
  ].join('/');

  const query = qs.stringify({
    ...(width ? { width: width * 2 } : {}),
    ...(width || height ? { height: height ? height * 2 : width * 2 } : {}),
    ...(round ? { round } : {}),
    ...(noCache ? { noCache } : {}),
    ...(image ? { image } : {}),
    ...(download ? { download } : {})
  });

  return [url, ...(query ? [query] : [])].join('?');
};

export const attributeMethodsFactory = (data, scopeData = {}) => {
  const { DEIP_SERVER_URL } = proxydi.get('env');

  return {
    data,

    // attrValue
    getAttributeValue(id) {
      return data?.attributes?.[id]?.value;
    },

    // attrHasValue
    attributeHasValue(id) {
      return hasValue(data?.attributes?.[id]?.value);
    },

    // attrFileSrc
    getAttributeFileSrc(attributeId, file) {
      const filename = file || data?.attributes?.[attributeId];

      const hasFileName = !!filename && filename !== 'null' && filename !== 'undefined';
      if (!hasFileName || !attributeId) {
        return '';
      }

      const { scopeName: scope, scopeId } = scopeData;

      if (!(scope && scopeId)) {
        throw new Error('No scope data provided');
      }
      return getAttributeFileSrc({
        serverUrl: DEIP_SERVER_URL,
        scope,
        scopeId,
        attributeId,
        filename
      });
    }
  };
};
