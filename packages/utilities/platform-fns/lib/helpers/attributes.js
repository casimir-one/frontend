import qs from 'qs';
import { hasValue } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';

export const expandAttributes = (
  attrs,
  idKey = 'attributeId',
  valueKey = 'value'
) => (attrs || []).reduce((acc, attr) => ({
  ...acc,
  ...{
    [attr[idKey]]: attr[valueKey]
  }
}), {});

export const compactAttributes = (
  attrs,
  idKey = 'attributeId',
  valueKey = 'value'
) => Object.keys(attrs || {})
  .map((id) => ({
    [idKey]: id,
    [valueKey]: attrs[id]
  }));

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
    scope,
    scopeId,
    'attribute',
    attributeId,
    'file',
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
    getAttributeValue(id) {
      return data?.attributes?.[id]?.value;
    },

    ifAttributeValue(id) {
      return hasValue(data?.attributes?.[id]?.value);
    },

    getAttributeFileSrc(attributeId, filename) {
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
