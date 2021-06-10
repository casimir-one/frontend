import { getImageSrc } from './common';

// DEPRECATED
export const tenantLogoSrc = (model, width, height, isRound, noCache) => {
  // eslint-disable-next-line no-unused-vars
  const { account: { name } = {}, _id: tenantId } = model;

  return getImageSrc(tenantId, 'tenant/logo', width || 120, height || 40, isRound, noCache);
};

// DEPRECATED
export const tenantBackgroundSrc = (model, width, height, isRound, noCache) => {
  // eslint-disable-next-line no-unused-vars
  const { account: { name } = {}, _id: tenantId } = model;

  return getImageSrc(tenantId, 'tenant/banner', width || 1440, height || 430, isRound, noCache);
};
