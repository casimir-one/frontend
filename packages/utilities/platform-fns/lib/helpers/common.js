import qs from 'qs';

export const getAttributeFileSrc = (
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
) => {
  const url = [
    window.env.DEIP_SERVER_URL,
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

export const getImageSrc = (
  itemId,
  from,
  width = 48,
  height = null,
  isRound = false,
  noCache = false
) => {
  const query = qs.stringify({
    width: width * 2,
    height: height ? height * 2 : width * 2,
    round: isRound,
    noCache
  });

  const pathArray = [
    window.env.DEIP_SERVER_URL,
    from,
    itemId,
    `?${query}`
  ];

  return pathArray.join('/');
};
