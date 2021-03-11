import { userAvatarSrc, userFullName, userLocation } from './user';
import { teamLogoSrc } from './team';

export const accountFullName = (model) => {
  const { account: { is_research_group: isTeam } } = model;

  return isTeam ? model.name : userFullName(model)
}

export const accountAvatarSrc = (model, width, height, isRound, noCache) => {
  const { account: { is_research_group: isTeam } } = model;

  return isTeam
    ? teamLogoSrc(model, width, height, isRound, noCache)
    : userAvatarSrc(model, width, height, isRound, noCache)
}

export const accountLocation = (model) => userLocation(model) // temp?
