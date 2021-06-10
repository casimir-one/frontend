import { getImageSrc } from './common';

// DEPRECATED
export const userFullName = (model) => {
  if (!model) return false;

  const { profile, account } = model;

  if (profile) {
    const { firstName = '', lastName = '' } = profile;

    if (firstName || lastName) {
      return [firstName, lastName].join(' ');
    }
  }

  return account.name;
};

// DEPRECATED
export const userLocation = (model) => {
  if (!model) return false;

  // const {
  //   profile: { location: { city, country } = {} } = {}
  // } = model;

  const city = model?.profile?.location?.city;
  const country = model?.profile?.location?.country;

  const res = [city, country].filter((item) => !!item);

  if (!res.length) return false;

  return res.join(', ');
};

// DEPRECATED
export const userAvatarSrc = (model, width, height, isRound, noCache) => {
  const { profile: { _id: profileId = 'initdelegate' } } = model;

  return getImageSrc(profileId, 'api/user/avatar', width || 48, height, isRound, noCache);
};
