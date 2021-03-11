import { getImageSrc } from './common';

export const teamLogoSrc = (model, width, height, isRound, noCache) => {
  const { externalId = null } = model;

  return getImageSrc(externalId, 'api/groups/logo', width || 48, height, isRound, noCache);
}
