import { getImageSrc } from './common';

export const tenantLogoSrc = (model, width, height, isRound, noCache) => {
  const { account: { name } = {}, _id: tenantId } = model;

  return getImageSrc(tenantId, 'tenant/logo', width || 120, height || 40, isRound, noCache);
}

export const tenantBackgroundSrc = (model, width, height, isRound, noCache) => {
  const { account: { name } = {}, _id: tenantId } = model;

  return getImageSrc(tenantId, 'tenant/banner', width || 1440, height || 430, isRound, noCache);
}
