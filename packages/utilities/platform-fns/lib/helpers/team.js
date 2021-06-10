import { getImageSrc } from './common';

// DEPRECATED
export const teamLogoSrc = (model, width, height, isRound, noCache) => {
  const externalId = model.externalId || model.external_id || null;

  return getImageSrc(externalId, 'api/groups/logo', width || 48, height, isRound, noCache);
};
