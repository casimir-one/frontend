import qs from 'qs';

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
