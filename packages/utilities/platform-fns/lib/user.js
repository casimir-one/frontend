import { getImageSrc } from './common';

export const userFullName = (model) => {
  if (!model) return false;

  const { profile, account} = model;

  if (profile) {
    const { firstName ='', lastName = ''} = profile;

    if (firstName || lastName) {
      return [firstName, lastName].join(' ');
    }
  }

  return account.name;
}

export const userLocation = (model) => {
  if (!model) return false;

  const {
    profile: { location: { city, country } = {} } = {}
  } = model;

  const res = [city, country].filter((item) => !!item);

  if (!res.length) return false;

  return res.join(', ');
}

export const userAvatarSrc = (model, width, height, isRound, noCache) => {
  const { profile: { _id: profileId = 'initdelegate'} } = model;

  return getImageSrc(profileId, 'api/user/avatar', width || 48, height, isRound, noCache);
}
