import qs from 'qs';

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
